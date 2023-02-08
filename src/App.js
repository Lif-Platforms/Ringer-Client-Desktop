//import logo from './logo.svg';
import './App.css';
import './css/login.css';
import React from 'react'

class LoginForm extends React.Component {
  render () {
    return(
      <form>
        <input type="text" placeholder="Username" id="username" />
      </form>
    )
  }
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Login With Lif</h1>
        <div><LoginForm /></div>
      </div>
    </div>
  );
}

export default App;
