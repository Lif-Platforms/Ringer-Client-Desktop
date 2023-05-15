import React from 'react';
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';
import { useEffect, useState } from 'react';
import MainPage from './Pages/main';
import CreateAccount from './Pages/createAccount';
import PasswordReset from './Pages/passwordReset';

function App() {

  // Define the navigation
  const navigate = useNavigate();
  // This will be changed to something else later
  const [redirectToLogin, setRedirectToLogin] = useState(false); // set this to true or false based on your condition

  // Navigates to Login Page
  useEffect(() => {
    if (!redirectToLogin) {
      console.log("Navigating to login page...")
      setRedirectToLogin(true);
      navigate("/Pages/login");
    }
  }, [redirectToLogin, navigate]);

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
