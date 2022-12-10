import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Loginpage.css";

function SubmitListingpage() {
    const location = useLocation();
    const [kitData, setKitData] = useState({weaponid: "1", sheenid: "1", killstreakerid: "1", datebought: "", sellingforpricerupiah: "", completionpricerupiah: "", priceboughtrupiah: ""});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    const [sheenList, setSheenList] = useState([{sheenname: "Loading sheen data", sheenid: "1"}]);
    const [killstreakerList, setKillstreakerList] = useState([{killstreakername: "Loading killstreaker data", killstreakerid: "1"}]);
    const [weaponList, setWeaponList] = useState([{weaponname: "Loading weapon data", weaponid: "1"}]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8082/viewtable?table=4")
        .then(res => res.json())
        .then(sheenData => setSheenList(sheenData));

        fetch("http://localhost:8082/viewtable?table=5")
        .then(res => res.json())
        .then(killstreakerData => setKillstreakerList(killstreakerData));

        fetch("http://localhost:8082/viewtable?table=6")
        .then(res => res.json())
        .then(weaponData => setWeaponList(weaponData));
    }, [location]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";
    let usernameText = "NOT LOGGED IN";
    let userToken = "";
    if(location.state && location.state) {
        if(location.state.username && location.state.username) {
            usernameText = location.state.username;
        }
        if(location.state.token && location.state.token) {
            userToken = location.state.token;
        }
    }

    const updateKitData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setKitData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };
    
    if(customStatusMessage.error === 0) {
        if((isNaN(+kitData.sellingforpricerupiah) && kitData.sellingforpricerupiah) || (isNaN(+kitData.priceboughtrupiah) && kitData.priceboughtrupiah) || (isNaN(+kitData.completionpricerupiah) && kitData.completionpricerupiah)) {
            errorMessage = "Prices must be a number";
            errorMessageClass = "statusmessagered";
        }
    }

    else if(customStatusMessage.error === 1) {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagered";
    }
    else {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagegreen";
    }

    const submitKitForm = (e) => {
        e.preventDefault();
        if(kitData.sellingforpricerupiah === ""
        || kitData.priceboughtrupiah  === ""
        || kitData.completionpricerupiah  === ""
        || kitData.datebought  === ""
        || kitData.weaponid === "1"
        || kitData.sheenid === "1"
        || kitData.killstreakerid === "1") {
            setCustomStatusMessage({message: "Please fill all fields", error: 1});
        }
        else {
            if(userToken === "") {
                setCustomStatusMessage({message: "You must be logged in to submit a listing", error: 1});
            }
            else {
                const payload = {
                    method: "POST",
                    headers: {"Content-Type": "application/json", "Authorization": userToken},
                    body: JSON.stringify(kitData),
                    mode: "cors"
                }
                fetch("http://localhost:8082/submitkitlisting", payload)
                .then(res => res.json())
                .then(message => setCustomStatusMessage({message: message.msg, error: 2}));
            }
        }
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/home", {state: {token: userToken, username: usernameText}})
    }

    const goToSoldKitsPage = (e) => {
        e.preventDefault();
        navigate("/soldkitspage", {state: {token: location.state.token, username: location.state.username}})
    }

    return(
        <>
        <div className="headertext">SUBMIT KIT LISTING
            <button className="toprightnavbutton" onClick={goToSoldKitsPage} >VIEW SOLD KITS</button>
            <button className="topleftnavbutton" onClick={goToHome} >HOME</button>
        </div>
        <div className="secondarytext">{usernameText}</div>
        <br></br>
        <form onSubmit={submitKitForm}>
            <table className="submitkittable">
                <tr>
                    <td>WEAPON NAME</td>
                    <td>
                        <select name="weaponid" className="submitkitinput"
                        value={kitData.weaponid} onChange={(e) => updateKitData(e)}>
                            {weaponList.map((weaponEntry) => {
                                return(
                                    <option value={weaponEntry.weaponid}>{weaponEntry.weaponname}</option>
                                )
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>SHEEN NAME</td>
                    <td>
                        <select name="sheenid" className="submitkitinput"
                        value={kitData.sheenid} onChange={(e) => updateKitData(e)}>
                            {sheenList.map((sheenEntry) => {
                                return(
                                    <option value={sheenEntry.sheenid}>{sheenEntry.sheenname}</option>
                                )
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>KILLSTREAKER</td>
                    <td>
                        <select name="killstreakerid" className="submitkitinput"
                        value={kitData.killstreakerid} onChange={(e) => updateKitData(e)}>
                            {killstreakerList.map((killstreakerEntry) => {
                                return(
                                    <option value={killstreakerEntry.killstreakerid}>{killstreakerEntry.killstreakername}</option>
                                )
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>DATE BOUGHT</td>
                    <td><input className="submitkitinput" type="date" name="datebought"
                    value={kitData.datebought} onChange={(e) => updateKitData(e)} /></td>
                </tr>
                <tr>
                    <td>BOUGHT FOR</td>
                    <td>Rp. <input className="submitkitinputprice" type="text" name="priceboughtrupiah"
                    value={kitData.priceboughtrupiah} onChange={(e) => updateKitData(e)} /></td>
                </tr>
                <tr>
                    <td>COMPLETED FOR</td>
                    <td>Rp. <input className="submitkitinputprice" type="text" name="completionpricerupiah"
                    value={kitData.completionpricerupiah} onChange={(e) => updateKitData(e)} /></td>
                </tr>
                <tr>
                    <td>SELLING FOR</td>
                    <td>Rp. <input className="submitkitinputprice" type="text" name="sellingforpricerupiah"
                    value={kitData.sellingforpricerupiah} onChange={(e) => updateKitData(e)} /></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div className={errorMessageClass}>{errorMessage}</div>
                        <input className="submitkitbutton" type="submit" value="SUBMIT" />
                    </td>
                </tr>
            </table>
        </form>
        </>
    );
}

export default SubmitListingpage;