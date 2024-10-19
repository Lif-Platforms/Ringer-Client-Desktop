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

    async function handle_authenticate() {
        let username = null;
        let token = null;

        // Get username and token from HTML local storage
        const localstorage_username = window.localStorage.getItem('username');
        const localstorage_token = window.localStorage.getItem('token');

        // Check if HTML local storage credentials exist
        // If so, move them over to electron storage
        if (localstorage_username && localstorage_token) {
            window.electronAPI.setAuthCredentials(localstorage_username, localstorage_token);

            // Remove HTML local storage credentials
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('token');

            console.log("HTML credentials detected! Moved to electron storage.");
        }

        // Request credentials from main process
        await window.electronAPI.getAuthCredentials().then((authInfo) => {
            if (authInfo) {
                username = authInfo.username;
                token = authInfo.token;
            }
        });

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
    }

    useEffect(() => {
        handle_authenticate();
    }, []);

    return (
       <div className="splash-screen">
            <img className="logo" src={RingerIcon} alt="" />
            <h1>Preparing Ringer</h1>
            <img className="loader" src={Loader} alt="" />
       </div>
    )
}

export default SplashScreen;