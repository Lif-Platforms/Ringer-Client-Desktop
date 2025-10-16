import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/login";
import MainPage from "./Pages/main";
import SplashScreen from "./Pages/spash";
import { InfoSidebarProvider } from "./providers/info_sidebar";

function App() {
  return (
      <InfoSidebarProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/direct_messages/:conversation_id?" element={<MainPage />} />
        </Routes>
      </InfoSidebarProvider>
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
