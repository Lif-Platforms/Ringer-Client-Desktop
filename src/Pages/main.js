// Import Files
import '../App.css';
import '../css/main.css';
import notification from '../assets/home/Notification.png';
import '../css/Animations/checkmark.css';
import Error_Image from "../assets/global/Error.png";
import connectSocket from "../Scripts/mainPage/notification_conn_handler";
import MoreIcon from "../assets/home/More-Icon.png";
import { log_out } from '../Scripts/utils/user-log-out';
// Import Modules
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

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
  async function handleAddConversation(add_user) {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/add_friend/${username}/${token}/${add_user}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        if (data.Status === "Ok") {
          setConversationAdded(true);
        }
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
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
function FriendRequestsPopup({ onClose, setFriendsListState }, props) {
  const [notificationData, setNotificationData] = useState('loading');
  const [reload, setReload] = useState(false); // Initialize reload state variable to false

  useEffect(() => {
    async function fetchData() {
      // Gets username and token
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/get_friend_requests/${username}/${token}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        console.log(data);
        console.log(typeof data);

        setNotificationData(JSON.parse(data));

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
    }
    fetchData();
  }, []);

  function handleClosePopup() {
    onClose();
  }

  async function handleAccept(request) {
    console.log('Accepting: ' + request);

    // Gets username and token
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/accept_friend_request/${username}/${token}/${request}`)
    .then(response => {
      if (response.ok) {
        return response.json(); // Convert response to JSON
      } else {
        throw new Error('Request failed with status code: ' + response.status);
      }
    })
    .then(data => {
      // Work with the data
      console.log(data);

      if (data.Status === "Ok") {
        setFriendsListState("loading")
        onClose();
      }

    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
  }

  async function handleDeny(request) {
    console.log("Denied friend request: " + request);
    
    // Gets username and token
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/deny_friend_request/${username}/${token}/${request}`)
    .then(response => {
      if (response.ok) {
        return response.json(); // Convert response to JSON
      } else {
        throw new Error('Request failed with status code: ' + response.status);
      }
    })
    .then(data => {
      // Work with the data
      console.log(data);

      if (data.Status === "Ok") {
        console.log(notificationData);
        console.log("Operation Successful");
      }

    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
  }

  if (notificationData === "loading") {
    return (
      <div className="friendRequestsPopup">
        <h2>Incoming Friend Requests</h2>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        <br />
        <button onClick={handleClosePopup} className='closeRequestsButton'>Close</button>
      </div>
    );
  } else if (Array.isArray(notificationData) && notificationData.length === 0) {
      return(
        <div className="friendRequestsPopup">
          <h2>Incoming Friend Requests</h2>
          <p>No Pending Requests</p>
          <button onClick={handleClosePopup} className='closeRequestsButton'>Close</button>
        </div>
      );
  } else if (Array.isArray(notificationData) && notificationData.length > 0) {
      return(
        <div className="friendRequestsPopup">
          <h2>Incoming Friend Requests</h2>
          <ul>
            {notificationData.map(item => (
              <li key={item}>
                {item.name}
                <button className='acceptButton' onClick={() => handleAccept(item.name)}>&#x2713;</button>
                <button className='denyButton' onClick={() => handleDeny(item.name)}>&#10060;</button>
            </li>
            ))}
          </ul>
          <button onClick={handleClosePopup} className='closeRequestsButton'>Close</button>
        </div>
      );
  } else {
    return(
      <div className="friendRequestsPopup">
          <h2>Incoming Friend Requests</h2>
          <img src={Error_Image} className='error_image' />
          <p>Something Went Wrong</p>
          <button onClick={handleClosePopup} className='closeRequestsButton'>Close</button>
      </div>
    )
  }
}

function FriendsList({friendsListState, setFriendsListState, switchConversation, selectedConversation, setSelectedConversation}) {

  function handle_friend_request_accept(data) {
    if (friendsListState !== "loading" && typeof friendsListState === "object") {
      // Create clone of friends list
      let friends_list = [...friendsListState];

      let user_found = false;

      // Check if user is already in list
      friends_list.forEach((user) => {
        if (user.Username === data.detail.username) {
          user_found = true;
          console.log("found user");
        }
      });

      if (!user_found) {
        friends_list.push({Username: data.detail.username, Id: data.detail.id});

        // Update friends list
        setFriendsListState(friends_list);
      }
    } else if (friendsListState !== "loading" && typeof friendsListState !== "object") {
      // Set new friends list
      setFriendsListState([{Username: data.detail.username, Id: data.detail.id}]);
    }
  }

  function handle_conversation_removal(data) {
    // Create clone of friends list
    let friends_list = [...friendsListState];

    // Keep track of conversation index
    let index = 0;

    // Check if conversation exists
    friends_list.forEach((conversation) => {
      if (conversation.Id === data.detail.id) {
        console.log("found conversation")
        friends_list.splice(index, 1);

      } else {
        index += 1;
      }
    })

    // Update friends list
    setFriendsListState(friends_list);

    // Check if removed conversation is currently selected
    if (data.detail.id === selectedConversation.Id) {
      setSelectedConversation("");
    }
  }

  document.addEventListener("Friend_Request_Accept", handle_friend_request_accept);
  document.addEventListener("Conversation_Removal", handle_conversation_removal);
  
  useEffect(() => {
    // Remove event listener on component unmount
    return () => {
      document.removeEventListener("Friend_Request_Accept", handle_friend_request_accept);
      document.removeEventListener("Conversation_Removal", handle_conversation_removal);
    }
  }, []);

  // Fetch friends list from server
  useEffect(() => {
    async function get_friends() {
      // Gets username and token
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      console.log("Request Username: " + username);
      console.log("Request Token: " + token);

      fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/get_friends_list/${username}/${token}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        console.log(data);

        if ("ERROR_CODE" in data) {
          setFriendsListState("Error");
        } else {
          setFriendsListState(data);
        }
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
    }
    if (friendsListState === "loading") {
      get_friends();
    }
  }, [friendsListState]) // Add empty dependency array here

  if (friendsListState === "loading") {
    return(
      <div className='friends_list'>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
    )
  } else if (friendsListState === "Error"){
    return(
      <div className='friends_list'>
        <img src={Error_Image} alt='Error' className='error_image' />
        <p>Something Went Wrong!</p>
      </div>
    )
  } else if (Array.isArray(friendsListState)) {
    return(
      <div className='friends_list'>
        {friendsListState.map(item => (
          <div className="friends">
            <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${item.Username}.png`} alt="Profile" />
            <button onClick={() => switchConversation(item.Username, item.Id)}>{item.Username}</button>
          </div>
        ))}
      </div> 
    );
  }
}

// Sidebar component
function SideBar({switchConversation, friendsListState, setFriendsListState, selectedConversation, setSelectedConversation}) {
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
        {showNotificationPopup && <FriendRequestsPopup onClose={handleCloseNotificationPopup} setFriendsListState={setFriendsListState} />}
      </div>
      <FriendsList 
        friendsListState={friendsListState} 
        setFriendsListState={setFriendsListState} 
        switchConversation={switchConversation}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
    </div>
  );   
}

function UserOptionMenu({ optionMenuState, setOptionMenuState }) {

  const navigate = useNavigate();

  async function handle_log_out() {
    const status = await log_out();

    if (status === "OK") {
      navigate("/");
    }
  }

  if (optionMenuState === "open") {
    return(
      <div className='user-option-menu'>
        <h1>Options</h1>
        <hr />
        <div className='options'>
          <button onClick={handle_log_out}>Log Out</button>
          <button onClick={() => setOptionMenuState('closed')}>Close</button>     
        </div>
      </div>
    )
  }
}

// Component for user profile
function UserProfile() {
  const [username, setUsername] = useState('');
  const [optionMenuState, setOptionMenuState] = useState('closed');

  useEffect(() => {
    async function fetchData() {
      const username = localStorage.getItem('username');
      setUsername(username);
    }
    fetchData();
  }, []);
  let url = `${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${username}.png`;
  return (
    <div className="userProfile">
      <div className="avatar">
        <img src={url} alt="Avatar" draggable="false" />
      </div>
      <div>
        <h1>{username}</h1>
      </div>
      <button onClick={() => setOptionMenuState('open')}><img src={MoreIcon} /></button>
      <UserOptionMenu optionMenuState={optionMenuState} setOptionMenuState={setOptionMenuState} />
    </div>
  );
}

// Component for unfriending someone 
function UnfriendUser({ unfriendState, setUnfriendState, selectedConversation, friendsListState, setFriendsListState, setSelectedConversation }) {
  // Handle the unfriending process
  async function handle_unfriend() {
    // Set popup state
    setUnfriendState('loading');

    // Get client auth info
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/remove_conversation/${selectedConversation.Id}/${username}/${token}/`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        console.log(data);
        if (data.Status === "Ok") {
          // Make clone of friends list
          let friends_list = [...friendsListState];

          // Keep track of array index
          let index = 0;

          // Remove conversation from friends list
          friends_list.forEach((conversation) => {
            if (conversation.Id === selectedConversation.Id) {
              friends_list.splice(index, 1);

            } else {
              index += 1;
            }
          });

          // Update friends list
          setFriendsListState(friends_list);

          // Set elected conversation
          setSelectedConversation("");

          setUnfriendState("completed");
        }
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }

  if (unfriendState !== "hide" && unfriendState !== "loading" && unfriendState !== "completed") {
    return(
      <div className='unfriend-popup'>
        <h1>Unfriend {unfriendState}?</h1>
        <p>You will no longer be able to send or receive messages from this person.</p>
        <div>
          <button id='unfriend-button' onClick={handle_unfriend}>Yes, Do it!</button>
          <button id='unfriend-cancel-button' onClick={() => setUnfriendState('hide')}>No, Don't!</button>
        </div>
      </div>
    )
  } else if (unfriendState === "loading") {
    return(
      <div className='unfriend-popup'>
        <div className="lds-ellipsis">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    )
  } else if (unfriendState === "completed") {
    return(
      <div className='unfriend-popup'>
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h1>Successfully Unfriended User</h1>
          <button onClick={() => setUnfriendState('hide')}>Close</button>
      </div>
    )
  }
}

// Component for messages
function Messages({ selectedConversation, friendsListState, setFriendsListState, setSelectedConversation }) {
  const [messages, setMessages] = useState('loading');
  const [unfriendState, setUnfriendState] = useState('hide');

  // Allow messages to be changed during the runtime of the socket function
  const messagesRef = useRef(messages);

  // Allow the conversation id to be changed during the runtime of the socket function
  const conversationIdRef = useRef(selectedConversation.Id);

  // Update messages ref when they are changed
  useEffect(() => {
    if (messages !== "loading" && messages !== false) {
      messagesRef.current = messages;
      console.log("Updated Messages: ", messagesRef.current);
      console.log(typeof messages)

      // Scroll to the bottom of the message
      let messages_div = document.getElementById("message-container");
      if (messages_div) {
        messages_div.scrollTop = messages_div.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    conversationIdRef.current = selectedConversation.Id;
    console.log("Updated conversation id: ", conversationIdRef.current);
  }, [selectedConversation])

  // Start websocket connection to notification server
  useEffect(() => {
    connectSocket(conversationIdRef, messagesRef, setMessages);
    
    return () => {
      connectSocket.close_conn();
    }
  }, []);
   
  // Load messages
  useEffect(() => {
    async function handle_message_load() {
      // Get auth data
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      // Change the message container to loading
      setMessages('loading');

      fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/load_messages/${username}/${token}/${selectedConversation.Id}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        console.log(data);
        setMessages(data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
    }
    handle_message_load()
  }, [selectedConversation])

  return (
    <div className="messages">
      {selectedConversation && (
        <div className='conversationHeader'>
          <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${selectedConversation.Name}.png`} alt="Avatar" draggable="false" className='selectedConversationAvatar' />
          <h1>{selectedConversation.Name}</h1>  
          <button className='unfriend-button' title="Unfriend" onClick={() => setUnfriendState(selectedConversation.Name)}>&#10006;</button>
        </div>
      )}
      {messages === 'loading' ? (
        <div className="lds-ellipsis">
          <div></div><div></div><div></div><div></div>
        </div>
      ) : (
        typeof messages === 'object' && messages !== null ? (
          <div className='message-container' id='message-container'>
            {messages.map((message, index) => (
              <div key={index} className='message'>
                <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${message.Author}.png`} alt='' />
                <div>
                  <h1>{message.Author}</h1>
                  <p>{message.Message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1>Nothing to see here...</h1>
        )
      )}
      <UnfriendUser 
        unfriendState={unfriendState}
        setUnfriendState={setUnfriendState}
        selectedConversation={selectedConversation}
        friendsListState={friendsListState} 
        setFriendsListState={setFriendsListState}
        setSelectedConversation={setSelectedConversation}
      />
    </div>
  );
}

// Component for text input
function MessageSender({conversationId}) {

  async function handle_send(event) {
    // Checks if the enter key was pressed
    if (event.key === 'Enter') {
      console.log('enter was pressed!');

      const message = document.getElementById('message-box').value; 
      document.getElementById('message-box').value = "Sending..."; 
      document.getElementById('message-box').disabled = true; 

      // Send message
      const message_status = await connectSocket.send_message(message, conversationId.Id);

      if (message_status === "message_sent") {
        document.getElementById('message-box').value = null; 
        document.getElementById('message-box').disabled = false;
        document.getElementById('message-box').focus();
      }
    }
  }

  useEffect(() => {
    // Only allows input if a conversation is selected
    if (conversationId) {
      document.getElementById('message-box').disabled = false;
    } else {
      document.getElementById('message-box').disabled = true;
    }
  }, [conversationId])
  
  return (
    <div className="messageSender">
      <input placeholder="Send a Message" onKeyDown={handle_send} id='message-box' />
    </div>
  );
}

// Main Component for this page
function MainPage() {
  const [friends, setFriends] = useState({});
  const [selectedConversation, setSelectedConversation] = useState('');
  const [friendsListState, setFriendsListState] = useState('loading');

  useEffect(() => {
    async function getToken() {
      const token = localStorage.getItem('token');
      console.log("Token: " + token);
    }

    getToken();
  }, []);

  const switchConversation = (conversationName, conversationId) => {
    const selectedConversation = {
      Name: conversationName,
      Id: conversationId
    };
    console.log(selectedConversation);
    setSelectedConversation(selectedConversation);
  };

  return (
    <div className="appContainer">
      <div>
        <SideBar 
          friendsListState={friendsListState} 
          setFriendsListState={setFriendsListState} 
          friends={friends} 
          setFriends={setFriends} 
          switchConversation={switchConversation}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
        <UserProfile />
      </div>
      <div className="messagesContainer">
        <Messages 
          selectedConversation={selectedConversation}
          friendsListState={friendsListState}
          setFriendsListState={setFriendsListState}
          setSelectedConversation={setSelectedConversation}
        />
        <MessageSender conversationId={selectedConversation} />
      </div>
      <ReconnectingBar />
    </div>
  );
}

export default MainPage;