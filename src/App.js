import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';
import MainPage from './Pages/main';
import PasswordReset from './Pages/passwordReset';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Pages/main" element={<MainPage />} />
        <Route path="/Pages/passwordReset" element={<PasswordReset />} />
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
