// Import Files
import '../App.css';
import '../css/main.css';
import profile from '../Images/profile_placeholder.png';
import notification from '../Images/Notification.png';
import { acceptFriendRequest, addNewConversation } from '../Scripts/mainPage/connectionHandler';
import { requestFriendRequestsList } from '../Scripts/mainPage/connectionHandler';
import { GetToken } from '../Scripts/mainPage/getToken';
import { GetUsername } from '../Scripts/mainPage/getUsername';
import '../css/Animations/checkmark.css';
import { getFriends } from '../Scripts/mainPage/connectionHandler';
// Import Modules
import React, { useState, useEffect } from 'react';

// Component for showing if the client is reconnecting
function ReconnectingBar() {
  return (
    <div className='reconnectBarHide' id="ReconnectBar">
      <p>Reconnecting...</p>
    </div>
  )
}

// Pop up menu for adding new conversations
function AddNewConversationMenu(props) {
  const [conversationAdded, setConversationAdded] = useState(false);

  const handleClose = () => {
    props.onClose();
  };

  // Function for handling adding conversations
  async function handleAddConversation(username) {
    const result = await addNewConversation(username);
    
    console.log(result); 
    setConversationAdded(true);
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={handleClose}>
          &times;
        </span>
        {conversationAdded ? (
          <>
            <h3>Request Sent!</h3>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </>
        ) : (
          <>
            <h3>Add Friend</h3>
            <input placeholder='Example: RingerBot123' id="conversationInput"></input>
            <br />
            <br />
            <span className='addConversation' onClick={() => handleAddConversation(document.getElementById('conversationInput').value)}>Add</span>
          </>
        )}
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

  async function handleAccept(request) {
    const status = await acceptFriendRequest(request);
    console.log(status)
  }

  function handleDeny(request) {
    console.log("Denied friend request: " + request);
  }

  if (isLoading) {
    return <div></div>;
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
  const [friends, setFriends] = useState({});

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

  useEffect(() => {
    async function getFriendsList() {
      const friends = await getFriends();
      console.log("Friends" + friends)
      setFriends(friends);
    }

    getFriendsList();
  }, []);

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
      {Object.keys(friends).length > 0 ? (
        <div className="friendsList">
          {Object.keys(friends).map((key) => (
            <div key={key} className='friends'> 
            <button>{key}</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
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
      <ReconnectingBar />
    </div>
  );
}

export default MainPage;