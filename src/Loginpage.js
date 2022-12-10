import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './Loginpage.css';

function Loginpage() {

  const [logindata, setLogindata] = useState({});
  const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: true});

  const updateLogindata = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setLogindata(values => ({...values, [name]: value}));
  };

  const navigate = useNavigate();

  let errorMessage = customStatusMessage.message;
  let errorMessageClass = customStatusMessage.error ? "statusmessagered" : "statusmessagegreen";

  const login = (e) => {
    e.preventDefault();
    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
      mode: "cors"
    }
    fetch('http://localhost:8082/login', payload)
    .then(res => res.json())
    .then((postResponse) => {
      if(postResponse.loginsuccess === true) {
        setCustomStatusMessage({message: postResponse.message, error: false});
        navigate("/home", {state: {token: postResponse.token, username: postResponse.username}});
      }
      else if(postResponse.message) {
        setCustomStatusMessage({message: postResponse.message, error: true});
      }
      else {
        setCustomStatusMessage({message: "Unknown error", error: true});
      }
    });
  }

  return (
    <><div className="headertext">LOGIN</div>
    
    <div className="loginbox">
      <form onSubmit={login}>
        <table>
            <input type="text" className="usernameinput" placeholder="Username" name="username" title="Username" value={logindata.username} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <input type="text" className="passwordinput" placeholder="Email" name="email" title="Email" value={logindata.email} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <input type="password" className="passwordinput" placeholder="Password" name ="password" title="Password" value={logindata.password} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <p className={errorMessageClass}>{errorMessage}</p>
            <input className="tf2button" type="submit" value="Login" />
            
            <p className="subtextnoaccount">Don't have an account?</p>
            <p className="subtextlogin"><Link to="/register"><u>Register here</u></Link></p>
        </table>
      </form>
    </div>
    <p className="disclaimer">Team Fortress is a trademark and/or registered trademark of Valve Corporation.</p>
    <Outlet />
    </>
  );
}

export default Loginpage;
