import React from 'react';
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';
import { useEffect, useState } from 'react';
import MainPage from './Pages/main';
import CreateAccount from './Pages/createAccount';
import PasswordReset from './Pages/passwordReset';
import Cookies from 'js-cookie';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('Token');
    const username = Cookies.get('Username');

    // Check if the user is already logged in
    if (token && username) {
      console.log('User is logged in.');
      navigate('/Pages/main');
    } else {
      console.log('User is not logged in.');
      navigate('/Pages/login');
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/Pages/login" element={<LoginPage />} />
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
