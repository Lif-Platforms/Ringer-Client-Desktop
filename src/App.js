//import files
import './App.css';
import './css/login.css';
import { logIn } from './Scripts/login.js'
//import modules 
import React from 'react';


//Component for the login form
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
        <button className='loginButton' onClick={logIn} type="button">Login</button>
      </form>
    )
  }
}

//Component for sign-up form
class SignUpForm extends React.Component {
  render () {
    return(
      <div className='signUp'>
        <h1 className='signUpHeader'>New Here?</h1>
        <button>Sign Up</button>
      </div>
    )
  }
}

//Main App Function
function App() {
  return (
    <div className="App">
      <div className="container">
        <section>
          <h1 className='loginLifHeader'>Login With Lif</h1>
          <LoginForm />
        </section>
        <SignUpForm />
      </div>
    </div>
  );
}

export default App;
