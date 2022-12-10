const createError = require('http-errors');
const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 8082;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');

let userdata = {};

app.use(cors());

const con = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "listeditor",
    password: "ICanDoALotOfThings",
    database: "killstreaktrading"
});

app.use(multer().array());
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

dotenv.config();

function generateAccessToken(identifier) {
    return jwt.sign(identifier, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(token == null) {
        return res.status(401).json({
            message: "You need to be logged in to perform this action."
        });
    }
    else {
        jwt.verify(token, process.env.TOKEN_SECRET.toString(), (err, user) => {
            if(err) {
                console.log(err);
                return res.status(403).json({
                    message: "Incorrect login."
                });
            }
            else {
                req.user = user;
                //console.log(user);
                //console.log(user.identifier);
                const sqlQueryCheckUserIdFromEmail = "SELECT userid FROM userlist WHERE email = '" + user.identifier + "'";
                con.query(sqlQueryCheckUserIdFromEmail, (err, rows) => {
                    //console.log(rows[0]);
                    if(rows[0]) {
                        req.userid = rows[0].userid;
                        //console.log(req.userid);
                        next();
                    }
                    else {
                        return res.status(403).json({
                            message: "Error!"
                        });
                    }
                });
                
            }
        });
    }
}

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.post('/register', (req, res) => {
    userdata = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    //console.log("Detected POST request at /register");
    //console.log(userdata.password);
    let hashedPassword = crypto.createHash('md5').update(userdata.password).digest('hex');
    //console.log(hashedPassword);
    if(userdata.email && userdata.username && userdata.password) {
        sqlQueryInsertUser = "INSERT INTO userlist (email, username, password) VALUES ('" + userdata.email + "', '" + userdata.username + "', '" + hashedPassword + "')";
        con.query(sqlQueryInsertUser, (err) => {
            if (err) {
                res.status(400).json({
                    message: "Failure. Username or email is likely already in use.",
                    registersuccess: false
                });
            }
            else {
                res.status(200).json({
                    message: "Success. You can now login.",
                    registersuccess: true
                    //token: token
                });
            }
        });
    // let token = jwt.sign(userdata, global.config.secretKey, {
    //     algorithm: global.config.algorithm,
    //     expiresIn: '1h'
    // });
    }
    else {
        res.status(400).json({
            message: "Idk the error.",
            registersuccess: false
            //token: token
        });
    }
});

app.get('/register', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Use post method here :>",
        registersuccess: false
        //token: token
    });
});

app.post('/login', (req, res) => {
    if(req.body.email && req.body.username && req.body.password) {
        userdata = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        const identifierToUse = userdata.email; // + userdata.username;
        const sqlQueryCheckUserPassword = "SELECT email, password FROM userlist WHERE username = '" + userdata.username + "'";
        con.query(sqlQueryCheckUserPassword, (err, rows) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                let hashedPassword = crypto.createHash('md5').update(userdata.password).digest('hex');
                // console.log(rows[0]);
                if(rows[0]) {
                    if(userdata.email == rows[0].email && hashedPassword == rows[0].password ) {
                        const token = generateAccessToken({ identifier: identifierToUse });
                        res.status(200).json({
                            token: token,
                            loginsuccess: true,
                            username: userdata.username,
                            message: "Login success!"
                        });
                    }
                    else {
                        res.status(400).json({
                            loginsuccess: false,
                            message: "Email or password is incorrect."
                        });
                    }
                }
                else {
                    //console.log("This also got triggered");
                    res.status(400).json({
                        loginsuccess: false,
                        message: "Username not found."
                    });
                }
            }
        });
    }
    else {
        res.status(400).json({
            loginsuccess: false,
            message: "Please fill in all info."
        });
    }
});

app.get('/login', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Use post method here :>",
        loginsuccess: false
        //token: token
    });
});

app.get('/testlogin',  authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Login with token successful.",
        userid: req.userid
    });
});

app.get('/viewtable', (req, res) => {

    let sqlQueryToUse = "SELECT listedkitslist.kitid, listedkitslist.datebought, listedkitslist.priceboughtrupiah, listedkitslist.completionpricerupiah, listedkitslist.sellingforpricerupiah, weaponlist.weaponname, sheenlist.sheenname, killstreakerlist.killstreakername, userlist.username FROM listedkitslist INNER JOIN weaponlist ON listedkitslist.weaponid = weaponlist.weaponid INNER JOIN sheenlist ON listedkitslist.sheenid = sheenlist.sheenid INNER JOIN killstreakerlist ON listedkitslist.killstreakerid = killstreakerlist.killstreakerid INNER JOIN userlist ON listedkitslist.byuser = userlist.userid";
    
    const tableToView = req.query.table;

    if(tableToView == 2) {
        sqlQueryToUse = "SELECT soldkitslist.datebought, soldkitslist.datesold, soldkitslist.priceboughtrupiah, soldkitslist.completionpricerupiah, soldkitslist.sellingforpricerupiah, weaponlist.weaponname, sheenlist.sheenname, killstreakerlist.killstreakername, userlist.username FROM soldkitslist INNER JOIN weaponlist ON soldkitslist.weaponid = weaponlist.weaponid INNER JOIN sheenlist ON soldkitslist.sheenid = sheenlist.sheenid INNER JOIN killstreakerlist ON soldkitslist.killstreakerid = killstreakerlist.killstreakerid INNER JOIN userlist ON soldkitslist.byuser = userlist.userid";
    }
    else if(tableToView == 3) {
        sqlQueryToUse = "SELECT materiallist.materialname, materialtypelist.materialtypename FROM materiallist INNER JOIN materialtypelist ON materiallist.materialtypeid=materialtypelist.materialtypeid";
    }
    else if(tableToView == 4) {
        sqlQueryToUse = "SELECT * FROM sheenlist ORDER BY sheenid ASC LIMIT 200";
    }
    else if(tableToView == 5) {
        sqlQueryToUse = "SELECT * FROM killstreakerlist ORDER BY killstreakerid ASC LIMIT 200";
    }
    else if(tableToView == 6) {
        sqlQueryToUse = "SELECT * FROM weaponlist ORDER BY weaponname ASC LIMIT 200";
    }
    

    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            res.sendStatus(500);
        }
        if (rows) {
            res.status(200).json(rows);
        }
    });
});


app.post('/users', function(req, res) {
    console.log(req.body);
    let user_id = req.body.id;
  
    res.send({
      'user_id': user_id
    });
  });

app.post('/submitkitlisting', authenticateToken, (req, res) => {
    
    const weaponid = req.body.weaponid;
    const datebought = req.body.datebought;
    const priceboughtrupiah = req.body.priceboughtrupiah;
    const completionpricerupiah = req.body.completionpricerupiah;
    const sellingforpricerupiah = req.body.sellingforpricerupiah;
    const sheenid = req.body.sheenid;
    const killstreakerid = req.body.killstreakerid;
    const userid = req.userid;

    let sqlQueryToUse = "INSERT INTO listedkitslist (weaponid, datebought, priceboughtrupiah, completionpricerupiah, sellingforpricerupiah, sheenid, killstreakerid, byuser) VALUES ("+ weaponid +", '" + datebought + "', " + priceboughtrupiah + ", " + completionpricerupiah + ", " + sellingforpricerupiah + ", " + sheenid + ", " + killstreakerid + ", " + userid + ")";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            res.send({ msg: "Error", err: true });
        }
        else {
            res.send({ msg: "Success", err: false });;
        }
    });
});

app.post('/movekitlisting', authenticateToken, (req, res) => {
    const userid = req.userid;
    const kitIdToMove = req.body.kitidtomove;
    let rowThatMatchesWithKitId = -1;
    const sqlQuerySelect = "SELECT * FROM listedkitslist";
    con.query(sqlQuerySelect, (err, rows) => {
        for(i in rows) {
            if(kitIdToMove == rows[i].kitid) {
                console.log("Match found");
                rowThatMatchesWithKitId = i;
                break;
            }
        }
        if(rowThatMatchesWithKitId == -1) {
            console.log("No match found! Aborting...");
        }
        else {
            if(rows[rowThatMatchesWithKitId].byuser == userid) {
                const weaponIdToWrite = rows[rowThatMatchesWithKitId].weaponid;
                const dateBoughtToWrite = rows[rowThatMatchesWithKitId].datebought;
                const priceBoughtToWrite = rows[rowThatMatchesWithKitId].priceboughtrupiah;
                const completionPriceToWrite = rows[rowThatMatchesWithKitId].completionpricerupiah;
                const sellingPriceToWrite = rows[rowThatMatchesWithKitId].sellingforpricerupiah;
                const sheenIdToWrite = rows[rowThatMatchesWithKitId].sheenid;
                const killstreakerIdToWrite = rows[rowThatMatchesWithKitId].killstreakerid;
                const dateSoldToWrite = req.body.datesold;
                const stringifiedDateBoughtToWrite = dateBoughtToWrite.toISOString().split('T')[0]
                const sqlQueryMove1 = "START TRANSACTION";
                const sqlQueryMove2 = "INSERT INTO soldkitslist (weaponid, datebought, priceboughtrupiah, completionpricerupiah, sellingforpricerupiah, sheenid, killstreakerid, byuser, datesold) VALUES ("+ weaponIdToWrite +", '" + stringifiedDateBoughtToWrite + "', " + priceBoughtToWrite + ", " + completionPriceToWrite + ", " + sellingPriceToWrite + ", " + sheenIdToWrite + ", " + killstreakerIdToWrite + ", " + userid + ", '" + dateSoldToWrite + "')";
                const sqlQueryMove3 = "DELETE FROM listedkitslist WHERE kitid = " + kitIdToMove + "";
                const sqlQueryMove4 = "COMMIT";
                con.query(sqlQueryMove1);
                con.query(sqlQueryMove2);
                con.query(sqlQueryMove3);
                con.query(sqlQueryMove4);
                res.status(200).json({
                    message: "Row moved successfully."
                });
            }
            else {
                res.status(403).json({
                    message: "You do not own this kit listing."
                });
            }
        }
        if (err) {
            res.sendStatus(500);
        }
        else if(rowThatMatchesWithKitId == -1) {
            res.status(400).json({
                message: "A kit listing with that ID does not exist."
            });
        }
    });
});

app.listen(port, () => {
    console.log("Runna");
});