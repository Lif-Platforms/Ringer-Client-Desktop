import React from 'react';
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';
import { useEffect, useState } from 'react';
import MainPage from './Pages/main';
import CreateAccount from './Pages/createAccount';
import PasswordReset from './Pages/passwordReset';
import Cookies from 'js-cookie';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Pages/main" element={<MainPage />} />
        <Route path="/Pages/createAccount" element={<CreateAccount />} />
        <Route path="/Pages/passwordReset" element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Main;
