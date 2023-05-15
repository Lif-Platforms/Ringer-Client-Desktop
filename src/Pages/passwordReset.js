// Import files
import '../App.css';
import '../css/passwordReset.css';
// Import modules 
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';

// Component for stage 0 of password reset
function Stage0({ nextStage }) {

    function handleClick() {
        nextStage("stage1");
    }

    return(
        <div className='resetContainer'>
            <h1>Lost Your Password? Lets Fix That. First Enter Your Username.</h1>
            <input type='text' placeholder='Username'></input>
            <br />
            <button onClick={handleClick}>Done</button>
        </div>
    );
}

// Component for stage 1 of the reset process 
function Stage1({ nextStage }) {

    function handleClick() {
        nextStage("stage2"); 
    }

    return(
        <div className='resetContainer'>
            <h1>Great! Now We Need Your Email. Please Enter It Below.</h1>
            <input type='text' placeholder='Email'></input>
            <br />
            <button onClick={handleClick}>Done</button>
        </div>
    );
}

// Component for stage 2 of the reset process
function Stage2({ nextStage }) {

    function handleClick() {
        nextStage("stage3"); 
    }

    return(
        <div className='resetContainer'>
            <h1>We Sent A 5 Digit Code To Your Email. Please Enter It Below.</h1>
            <input type='text' pattern="[0-9]" inputMode='numeric' placeholder='Code' id='codeBox' maxLength='5' />
            <br />
            <button onClick={handleClick}>Done</button>
        </div>
    );
}


// Component for stage 3 of the reset process
function Stage3({ nextStage }) {

    function handleClick() {
        nextStage("stage4"); 
    }

    return(
        <div className='resetContainer'>
            <h1>Perfect! Now Enter Your New Password Below.</h1>
            <input type='password' placeholder='Password'></input>
            <br />
            <button onClick={handleClick}>Done</button>
        </div>
    );
}

// Component for stage 3 of the reset process
function Stage4() {

    return(
        <div className='resetContainer'>
            <h1>Your All Set! Try To Remember Your Password This Time.</h1>
            <Link to="/Pages/login">&lt;&lt; Back To Login</Link>
        </div>
    );
}

// Main Function For Password Reset Page
function PasswordReset() {

    const [stage, setStage] = useState("stage0");

    function nextStage(stage) {
        setStage(stage); 
    }
  
    if (stage === 'stage1') {
        return <Stage1 nextStage={nextStage} />; 

    } else if (stage === 'stage2') {
        return <Stage2 nextStage={nextStage} />;

    } else if (stage === 'stage3') {
        return <Stage3 nextStage={nextStage} />;

    } else if (stage === 'stage4') {
        return <Stage4 />;

    } else {
        return <Stage0 nextStage={nextStage} />;
    }
  }
  
export default PasswordReset;