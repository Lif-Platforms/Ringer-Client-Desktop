// Import files
import '../App.css';
import '../css/login.css';
import { logIn } from '../Scripts/login.js';
// Import modules 
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Component for the login form
class LoginForm extends React.Component {
  render () {
    return(
      <form className='loginForm' ref={this.props.loginRef}>
        <input name="username" type="text" placeholder="Username" id="username" />
        <br />
        <br />
        <input name="password" type="password" placeholder='Password' id='password'/>
        <br />
        <br />
        <button 
          className='loginButton' 
          ref={this.props.loginButtonRef}
          onClick={() => logIn(
                            this.props.navigate, 
                            this.props.loginRef.current,
                            this.props.errorRef.current,
                            this.props.loginButtonRef.current
                          )} 
          type="button">
            Login
        </button>
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
        <Link onClick={() => window.electronAPI.openURL('https://my.lifplatforms.com/#/account_recovery')}>Forgot Password</Link>
        <p ref={this.props.errorRef} style={{"color": "red"}}></p>
      </div>
    );
  }
}

// Main Function For Login Page
function LoginPage() {
  const loginFormRef = useRef();
  const errorRef = useRef();
  const loginButtonRef = useRef();

  // Define the navigation
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="container">
        <section>
          <h1 className='loginLifHeader'>Login With Lif</h1>
          <LoginForm navigate={navigate} loginRef={loginFormRef} errorRef={errorRef} loginButtonRef={loginButtonRef} />
          <LoginFooter errorRef={errorRef} />
        </section>
        <SignUpForm />
      </div>
    </div>
  );
}

export default LoginPage;
