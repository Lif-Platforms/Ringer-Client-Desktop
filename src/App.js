import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/login";
import MainPage from "./Pages/main";
import SplashScreen from "./Pages/spash";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Pages/main" element={<MainPage />} />
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
