// Import Files
import '../App.css';
import '../css/main.css';
import '../css/createAccount.css';
import { createAccount } from '../Scripts/createAccountPage/createAccount';

// Component For Sign Up Form
function SignUpForm() {
    return(
        <div className='signUpForm'>
            <h1>Sign Up</h1>
            <form>
                <input type='text' placeholder='Username' id='username'></input>
                <br />
                <input type='text' placeholder='Email' id='email'></input>
                <br />
                <input type='password' placeholder='Password' id='password'></input>
                <br />
                <button type='button' onClick={createAccount}>Create Account</button>
            </form>
            <p id='accountStatus'></p>
        </div>
    )
}

// Main Function for This Page
function CreateAccount() {
    return(
        <div className='pageContainer'>
            <SignUpForm />
        </div>
    );
}

export default CreateAccount;