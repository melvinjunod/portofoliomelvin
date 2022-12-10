import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function Home() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{weaponname: "Test", sheenname: "Test", killstreakername: "Test", username: "John", datebought: "2022-12-12", completionpricerupiah: "20000", priceboughtrupiah: "69000", sellingforpricerupiah: "2000000"}]);
    const [moveKitResponse, setMoveKitResponse] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8082/viewtable`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const moveKitListing = (e) => {
        const kitId = e.target.name;
        console.log("heard");
        const currentDate = new Date();
        const date = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,0)}-${currentDate.getDate().toString().padStart(2,0)}`;
        const payload = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": location.state.token },
            body: JSON.stringify({kitidtomove: kitId, datesold: date}),
            mode: "cors"
        }
        fetch(`http://localhost:8082/movekitlisting`, payload)
        .then(res => res.json())
        .then(jsondata => {setMoveKitResponse(jsondata.message)});
    }

    const navigate = useNavigate();

    const goToSubmitListingPage = (e) => {
        e.preventDefault();
        navigate("/submitlistingpage", {state: {token: location.state.token, username: location.state.username}})
    }

    const goToSoldKitsPage = (e) => {
        e.preventDefault();
        navigate("/soldkitspage", {state: {token: location.state.token, username: location.state.username}})
    }

    return(
        <>
        
        <div className="headertext">LIST OF CURRENTLY SELLING KITS
            <button className="toprightnavbutton" onClick={goToSubmitListingPage} >SUBMIT LISTING</button>
            <button className="topleftnavbutton" onClick={goToSoldKitsPage} >VIEW SOLD KITS</button>
        </div>
        
        <div className="secondarytext">{location.state.username || "NOT LOGGED IN"}</div>
        <div className="statusmessagered">{moveKitResponse}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>Item name</th>
                    <th>Sheen</th>
                    <th>Killstreaker</th>
                    <th>Owner</th>
                    <th>Date Bought</th>
                    <th>Bought+completed for</th>
                    <th>Selling for</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
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
                            <td><button
                            className={data.username === location.state.username ? "tf2buttonsmall" : "tf2buttonsmalldisabled"}
                            disabled={data.username === location.state.username ? false : true}
                            name={data.kitid}
                            onClick={(e) => {moveKitListing(e)}}
                            >MOVE</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default Home;