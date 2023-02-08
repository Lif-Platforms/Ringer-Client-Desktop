//import files
import './App.css';
import './css/login.css';
//import modules 
import React from 'react';


//Component for the login form
class LoginForm extends React.Component {
  render () {
    return(
      <form>
        <input type="text" placeholder="Username" id="username" />
        <br />
        <input type="text" placeholder='Password' id='password'/>
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
          <h1>Login With Lif</h1>
          <LoginForm />
        </section>
        <SignUpForm />
      </div>
    </div>
  );
}

export default App;
