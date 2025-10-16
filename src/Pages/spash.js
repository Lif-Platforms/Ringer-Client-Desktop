import "src/css/splash.css";
import RingerIcon from "src/assets/global/Ringer-Icon.png";
import Loader from "src/assets/global/loaders/loader-1.svg";
import React from "react";

/*
* Component for Ringer splash screen. It is in charge of authenticating the user before proceeding to the login or main page.
*/
function SplashScreen() {
    return (
       <div className="splash-screen">
            <img className="logo" src={RingerIcon} alt="" />
            <h1>Preparing Ringer</h1>
            <img className="loader" src={Loader} alt="" />
       </div>
    )
}

export default SplashScreen;