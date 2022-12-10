import { useState, React } from "react";
import { Outlet, Link } from "react-router-dom";
import './Loginpage.css';

function Registerpage() {

    const [userdata, setUserdata] = useState({});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    //const [registerFormIsPosted, setRegisterFormPostedStatus] = useState(false);

    const updateUserdata = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      if(customStatusMessage.error !== 0) {
        setCustomStatusMessage({message: "", error: 0});
      }
      setUserdata(values => ({...values, [name]: value}));
    }

    // useEffect((userdata) => {
    //   if(registerFormIsPosted) {
        
    //   }
    // } ,[userdata])

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";
    let registerButtonIsDisabled = true;
    let registerButtonClass = "disabled";

    if(customStatusMessage.error === 0) {
      if(userdata.password) {
        if(userdata.password.length >= 6) {
          if(userdata.password && userdata.confirmationpassword) {
            if(userdata.password === userdata.confirmationpassword) {
                errorMessage = "Passwords match!";
                errorMessageClass = "statusmessagegreen";
                if(userdata.email && userdata.username) {
                  registerButtonIsDisabled = false;
                  registerButtonClass = "";
                }
            }
            else {
                errorMessage = "Passwords don't match :<";
                errorMessageClass = "statusmessagered";
                registerButtonIsDisabled = true;
                registerButtonClass = "disabled";
            }
          }
        }
        else {
          errorMessage = "Password must be at least 6 characters in length";
          errorMessageClass = "statusmessagered";
        }
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
    

  const todo = (e) => {
    e.preventDefault();
    if(
      !userdata.username ||
      !userdata.email ||
      !userdata.password ||
      !userdata.confirmationpassword ||
      userdata.username.length > 32 ||
      userdata.email.length > 64 ||
      userdata.password.length > 32 ||
      userdata.confirmationpassword.length > 32 ||
      userdata.password.length < 6 ||
      userdata.password !== userdata.confirmationpassword
    ) {
      setCustomStatusMessage({message: "Extremely illegal inputs.", error: 1});
    }
    else {
      const payload = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(userdata),
      };
      console.log(JSON.stringify(userdata));
      //console.log("Yes");
      fetch('http://localhost:8082/register', payload)
      .then((res) => res.json())
      .then((postResponse) => {
        if(postResponse.registersuccess === true) {
            setCustomStatusMessage({message: "Registration success! You can now login.", error: 2});
        }
        else if(postResponse.registersuccess === false) {
          setCustomStatusMessage({message: "Username/email is already in use.", error: 1});
        }
        else {
          setCustomStatusMessage({message: "Uhhhhhh :sweating:", error: 1});
        }
      });
    }
  }

  return (
    <><div className="headertext">REGISTER</div>
    <br />
    <div className="loginbox">
      <form onSubmit={todo}>
        <table>
            <input type="text" className="usernameinput" placeholder="Username" value={userdata.username || ""} maxlength="32"
            name="username"
            title="Username"
            onChange={(e) => {updateUserdata(e)}}
            />
            <input type="email" className="passwordinput" placeholder="Email" value={userdata.email || ""} maxlength="64" 
            name="email"
            title="Email"
            onChange={(e) => {updateUserdata(e)}}
            />
            <input type="password" className="passwordinput" placeholder="Password" value={userdata.password || ""} maxlength="32"
            name="password"
            title="Password"
            onChange={(e) => {updateUserdata(e)}}
            />
            <input type="password" className="passwordinput" placeholder="Confirm password" value={userdata.confirmationpassword || ""} maxlength="32"
            name="confirmationpassword"
            title="Confirm password"
            onChange={(e) => {updateUserdata(e)}}
            />
            <p className={errorMessageClass}>{errorMessage}</p>
            <input className={"tf2button" + registerButtonClass} type="submit" value="Register" disabled={registerButtonIsDisabled} />
            <p className="subtextnoaccount">Already have an account?</p>
            <p className="subtextlogin"><Link to="/"><u>Login here</u></Link></p>
            
        </table>
      </form>
    </div>
    <p className="disclaimer">Team Fortress is a trademark and/or registered trademark of Valve Corporation.</p>
    <Outlet />
    </>
  );
}

export default Registerpage;
