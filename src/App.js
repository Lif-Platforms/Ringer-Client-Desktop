import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/login";
import MainPage from "./Pages/main";
import SplashScreen from "./Pages/spash";

function App() {
  return (
    <div style={{width: '100%'}}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/direct_messages/:conversation_id?" element={<MainPage />} />
      </Routes>
    </div>
  );
}

function Main() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

export default Main;
