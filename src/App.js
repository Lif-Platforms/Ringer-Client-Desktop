import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./Pages/login";
import MainPage from "./Pages/main";
import SplashScreen from "./Pages/spash";
import { InfoSidebarProvider } from "./providers/info_sidebar";
import { AnimatePresence, motion } from 'motion/react';

function App() {
  return (
      <InfoSidebarProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/direct_messages/:conversation_id?" element={<MainPage />} />
        </Routes>
      </InfoSidebarProvider>
  );
}

function Main() {
    const [isReady, setIsReady] = useState(false);

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
                navigate("/");
                setIsReady(true);

            } else {
                throw new Error("Request failed! Status code: " + response.status);
            }
        })
        .catch((err) => {
            console.error(err);
            navigate("/login");
            setIsReady(true);
        })
  }, []);

  return (
      <AnimatePresence>
        {isReady ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ height: "100%" }}
            transition={{ type: "spring", duration: 0.5 }}
            key="app"
          >
            <App />
          </motion.div>
        ) : (
            <SplashScreen />
        )}
      </AnimatePresence>
  );
}

export default Main;