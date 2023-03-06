// Import Files
import '../App.css';
import '../css/main.css';
import profile from '../Images/profile_placeholder.png';
import { addNewConversation } from '../Scripts/mainPage/connectionHandler';
// Import Modules
import React, { useState } from 'react';

function SimplePopup(props) {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={handleClose}>
          &times;
        </span>
        <h3>Add Conversation</h3>
        <input placeholder='Example: RingerBot123'></input>
        <br />
        <br />
        <span className='addConversation' onClick={addNewConversation}>Add</span>
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
        <h1>Direct Messages</h1>
        <button onClick={handleButtonClick}> + </button>
        {showPopup && <SimplePopup onClose={handleClosePopup} />}
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

function MainPage() {
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
