import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function Soldkitspage() {
    const location = useLocation();
    //console.log(location);

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

    const [tableData, setTableData] = useState([{weaponname: "Test", sheenname: "Test", killstreakername: "Test", username: "John", datebought: "2022-12-12", datesold: "2022-12-12", completionpricerupiah: "20000", priceboughtrupiah: "69000", sellingforpricerupiah: "2000000"}]);

    useEffect(() => {
        fetch(`http://localhost:8082/viewtable?table=2`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });

    const navigate = useNavigate();

    const goToSubmitListingPage = (e) => {
        e.preventDefault();
        navigate("/submitlistingpage", {state: {token: location.state.token, username: location.state.username}})
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/home", {state: {token: userToken, username: usernameText}})
    }

    return(
        <>
        
        <div className="headertext">LIST OF SOLD KITS
            <button className="toprightnavbutton" onClick={goToSubmitListingPage} >SUBMIT LISTING</button>
            <button className="topleftnavbutton" onClick={goToHome} >HOME</button>
        </div>
        
        <div className="secondarytext">{usernameText}</div>
        <br></br>
        <table className="kitstable">
            <tr>
                <th>Item name</th>
                <th>Sheen</th>
                <th>Killstreaker</th>
                <th>Owner</th>
                <th>Date Bought</th>
                <th>Bought+completed for</th>
                <th>Selling for</th>
                <th>Date Sold</th>
            </tr>
            {tableData.map((data) => {
                return(
                    <tr>
                        <td>{"Professional Killstreak "+data.weaponname+" Kit"}</td>
                        <td>{data.sheenname}</td>
                        <td>{data.killstreakername}</td>
                        <td>{data.username}</td>
                        <td>{data.datebought.substring(0, 10)}</td>
                        <td>Rp {(parseFloat(data.completionpricerupiah) + parseFloat(data.priceboughtrupiah)).toLocaleString("en")}</td>
                        <td>Rp {data.sellingforpricerupiah.toLocaleString("en")}</td>
                        <td>{data.datesold.substring(0, 10)}</td>
                    </tr>
                )
            })}
        </table>
        <Outlet />
        </>
    );
}

export default Soldkitspage;