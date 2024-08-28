import "src/css/splash.css";
import RingerIcon from "src/assets/global/Ringer-Icon.png";
import Loader from "src/assets/global/loaders/loader-1.svg";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
* Component for Ringer splash screen. It is in charge of authenticating the user before proceeding to the login or main page.
*/
function SplashScreen() {

    const navigate = useNavigate();

    useEffect(() => {
        // Get username and toke from local storage
        const username = window.localStorage.getItem("username");
        const token = window.localStorage.getItem("token");

        // Create form data for request
        const formdata = new FormData();
        formdata.append("username", username);
        formdata.append("token", token);

        // Verify auth credentials with Auth Server
        fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/auth/verify_token`, {
            method: "POST",
            body: formdata
        })
        .then((response) => {
            if (response.ok) {
                navigate("/direct_messages");

            } else {
                throw new Error("Request failed! Status code: " + response.status);
            }
        })
        .catch((err) => {
            console.error(err);
            navigate("/login");
        })
    }, [navigate]);

    return (
       <div className="splash-screen">
            <img className="logo" src={RingerIcon} alt="" />
            <h1>Preparing Ringer</h1>
            <img className="loader" src={Loader} alt="" />
       </div>
    )
}

export default SplashScreen;