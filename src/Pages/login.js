// Import files
import '../App.css';
import '../css/login.css';
import { logIn } from '../Scripts/login.js';
// Import modules 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from "react";

// Component for the login form
class LoginForm extends React.Component {
  render () {

    return(
      <form className='loginForm'>
        <input type="text" placeholder="Username" id="username" />
        <br />
        <br />
        <input type="password" placeholder='Password' id='password'/>
        <br />
        <br />
        <button className='loginButton' onClick={() => logIn(this.props.navigate)} type="button">Login</button>
      </form>
    );
  }
}

// Component for sign-up form
class SignUpForm extends React.Component {
  render () {
    return(
      <div className='signUp'>
        <h1 className='signUpHeader'>New Here?</h1>
        <button onClick={() => window.electronAPI.openURL("https://my.lifplatforms.com/#/create_account")} type='button'>Sign Up</button>
      </div>
    );
  }
}

class LoginFooter extends React.Component {
  render() {
    return(
      <div className='loginFooter'>
        <Link onClick={() => window.electronAPI.openURL("https://my.lifplatforms.com/#/account_recovery")}>Forgot Password</Link>
        <p id="loginStatus" style={{"color": "red"}}></p>
      </div>
    );
  }
}

// Main Function For Login Page
function LoginPage() {

  // Define the navigation
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Check if the user is already logged in
    if (token && username) {
      console.log('User is logged in.');
      navigate('/Pages/main');
    } else {
      console.log('User is not logged in.');
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <section>
          <h1 className='loginLifHeader'>Login With Lif</h1>
          <LoginForm navigate={navigate} />
          <LoginFooter />
        </section>
        <SignUpForm />
      </div>
    </div>
  );
}

export default LoginPage;
