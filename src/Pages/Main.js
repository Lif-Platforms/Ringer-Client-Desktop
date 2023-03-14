// Import Files
import '../App.css';
import '../css/main.css';
import profile from '../Images/profile_placeholder.png';
import { addNewConversation } from '../Scripts/mainPage/connectionHandler';
import { GetToken } from '../Scripts/mainPage/getToken';
// Import Modules
import React, { useState, useEffect } from 'react';

// Pop up menu for adding new conversations
function AddNewConversationMenu(props) {
  const handleClose = () => {
    props.onClose();
  };

  // Function for handling adding conversations
  async function handleAddConversation(username) {
    const result = await addNewConversation(username);
    
    console.log(result); 
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={handleClose}>
          &times;
        </span>
        <h3>Add Friend</h3>
        <input placeholder='Example: RingerBot123' id="conversationInput"></input>
        <br />
        <br />
        <span className='addConversation' onClick={() => handleAddConversation(document.getElementById('conversationInput').value)}>Add</span>
      </div>
    </div>
  );
}

// Component for direct message side bar
function SideBar() {
  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="sideBar">
      <div className="sidebarHeader">
        <h1>Friends</h1>
        <button onClick={handleButtonClick}> + </button>
        {showPopup && <AddNewConversationMenu onClose={handleClosePopup} />}
      </div>
    </div>
  );
}

// Component for user profile
function UserProfile() {
  return (
    <div className="userProfile">
      <div className="avatar">
        <img src={profile} alt="Avatar" draggable="false" />
      </div>
      <div>
        <h1>Username</h1>
      </div>
    </div>
  );
}

// Component for messages
function Messages() {
  return <div className="messages"></div>;
}

// Component for text input
function MessageSender() {
  return (
    <div className="messageSender">
      <input placeholder="Send a Message"></input>
    </div>
  );
}

// Main Component for this page
function MainPage() {
  useEffect(() => {
    async function Token(){
      const token = await GetToken(); 

      console.log("Token: " + token); 
    }
    Token()
  }, []); 
  return (
    <div className="appContainer">
      <div>
        <SideBar />
        <UserProfile />
      </div>
      <div className="messagesContainer">
        <Messages />
        <MessageSender />
      </div>
    </div>
  );
}

export default MainPage;
