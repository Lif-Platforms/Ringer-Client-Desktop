// Import Files
import '../App.css';
import '../css/main.css';
import profile from '../Images/profile_placeholder.png';
import notification from '../Images/Notification.png';
import { addNewConversation } from '../Scripts/mainPage/connectionHandler';
import { requestFriendRequestsList } from '../Scripts/mainPage/connectionHandler';
import { GetToken } from '../Scripts/mainPage/getToken';
import { GetUsername } from '../Scripts/mainPage/getUsername';
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

// Popup for showing all incoming friend requests
function FriendRequestsPopup({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      var output = await requestFriendRequestsList();
      console.log("Friends: " + output["Requests"]); 
      setNotificationData(output["Requests"]);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  function handleClosePopup() {
    onClose();
  }

  function handleAccept(request) {
    console.log("Accepted friend request: " + request);
  }

  function handleDeny(request) {
    console.log("Denied friend request: " + request);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="friendRequestsPopup">
      <h2>Incoming Friend Requests</h2>
      {notificationData.length === 0 ? (
        <p>You have no new friend requests.</p>
      ) : (
        <ul>
          {notificationData.map((request, index) => (
            <li key={index}>
              {request}
              <button onClick={() => handleAccept(request)} className='acceptButton'>&#x2713;</button>
              <button onClick={() => handleDeny(request)} className='denyButton'>&#10060;</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleClosePopup} className='closeRequestsButton'>Close</button>
    </div>
  );
}



// Component for direct message side bar
function SideBar() {
  const [showPopup, setShowPopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleNotificationButtonClick = () => {
    setShowNotificationPopup(true);
  };

  const handleCloseNotificationPopup = () => {
    setShowNotificationPopup(false);
  };

  return (
    <div className="sideBar">
      <div className="sidebarHeader">
        <h1>Friends</h1>
        <button onClick={handleNotificationButtonClick} className='notificationButton'>
          <img src={notification} alt="notification"/>
        </button>
        <button onClick={handleButtonClick} className='addFriendButton'> + </button>
        {showPopup && <AddNewConversationMenu onClose={handleClosePopup} />}
        {showNotificationPopup && <FriendRequestsPopup onClose={handleCloseNotificationPopup} />}
      </div>
    </div>
  );
}


// Component for user profile
function UserProfile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchData() {
      const username = await GetUsername();
      setUsername(username);
    }
    fetchData();
  }, []);
  return (
    <div className="userProfile">
      <div className="avatar">
        <img src={profile} alt="Avatar" draggable="false" />
      </div>
      <div>
        <h1>{username}</h1>
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
    Token();
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