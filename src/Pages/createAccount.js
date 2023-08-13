// Import Files
import '../App.css';
import '../css/main.css';
import '../css/createAccount.css';
import { createAccount } from '../Scripts/createAccountPage/createAccount';
import { useNavigate } from 'react-router-dom';

// Component For Sign Up Form
function SignUpForm() {
    // Handle account creation process
    async function handle_create_account() {
        document.getElementById('create-button').innerHTML = '<div class="loader"></div>';

        const status = await createAccount();

        // Check status of operation
        if (status.status === "COMPLETE!") {
            document.getElementById('accountStatus').innerHTML = "Account Created!";
            document.getElementById('accountStatus').style.color = "green";
        } else {
            // Return reason account creation failed
            document.getElementById('accountStatus').innerHTML = status.reason;
            document.getElementById('accountStatus').style.color = "red";
        }

        document.getElementById('create-button').innerHTML = 'Create Account';
    }
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
                <button type='button' id='create-button' onClick={handle_create_account}>Create Account</button>
            </form>
            <p id='accountStatus' />
        </div>
    )
}

// Main Function for This Page
function CreateAccount() {
    const navigate = useNavigate();

    // Handle back button
    function handle_back_button() {
        navigate('/pages/login');
    }
    return(
        <div className='bg'>
            <div className='appContainer'>
                <div className='pageContainer'>
                    <SignUpForm />
                </div>
                <button className='back-button' onClick={handle_back_button}>&#11013; Back</button>
            </div> 
        </div>  
    );
}

export default CreateAccount;