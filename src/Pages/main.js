// Import Files
import '../App.css';
import '../css/main.css';
import '../css/Animations/checkmark.css';
import connectSocket from "../Scripts/mainPage/notification_conn_handler";
import MoreIcon from "../assets/home/More-Icon.png";
import { log_out } from '../Scripts/utils/user-log-out';
import SideOptionsBar from 'src/components/main/side_options_menu';
import SideBar from 'src/components/main/side_bar';
import Messages from 'src/components/main/messages';
import Send_Button from '../assets/home/send_button.svg';
import TypingIndicator from 'src/components/main/typing_indicator';
import Clock from '../assets/home/clock_icon.png';
import Clock_Active from '../assets/home/clock_icon_active.png';
import MessageDestructSelector from 'src/components/main/message_destruct_selector';
// Import Modules
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import GifSelector from 'src/components/main/gif_selector';
const ipcRenderer = window.electron.ipcRenderer;

// Component for showing if the client is reconnecting
function ReconnectingBar() {
  return (
    <div className='reconnectBarHide' id="ReconnectBar">
      <p>Reconnecting...</p>
    </div>
  )
}

function UpdateDownloaded() {
  const [showUpdatePanel, setShowUpdatePanel] = useState();

  useEffect(() => {
    const updateDownloadedHandler = (release) => {
      setShowUpdatePanel(release.version);
    };

    ipcRenderer.on('update-downloaded', updateDownloadedHandler);
  }, []);

  if (showUpdatePanel) {
    return (
      <div className='update-downloaded-popup'>
        <h1>Update Ready</h1>
        <p>Ringer version {showUpdatePanel} has been downloaded and will be installed upon next restart.</p>
        <button onClick={() => setShowUpdatePanel(null)}>Maybe Later</button>
        <button onClick={() => window.electronAPI.restartApp()} style={{backgroundColor: "orange"}}>Restart Now</button>
      </div>
    )
  }
}

function UserOptionMenu({ optionMenuState, setOptionMenuState }) {

  const navigate = useNavigate();

  async function handle_log_out() {
    const status = await log_out();

    if (status === "OK") {
      navigate("/login");
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

// Component for text input
function MessageSender() {
  const messageBox = useRef();
  const [typing, setTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const sendButton = useRef();
  const [showSelector, setShowSelector] = useState(false);
  const [messageDestruct, setMessageDestruct] = useState(null);
  const [messageDestructIconSrc, setMessageDestructIconSrc] = useState(Clock);
  const [showGifSelector, setShowGifSelector] = useState(false);

  useEffect(() => {
    if (messageDestruct) {
      setMessageDestructIconSrc(Clock_Active);
    } else {
      setMessageDestructIconSrc(Clock);
    }
  }, [messageDestruct]);

  // Get conversation id from url
  const { conversation_id } = useParams();

  const handleKeyPress = () => {
    clearTimeout(typingTimer);
    setTyping(true);
  };

  const handleKeyUp = () => {
      clearTimeout(typingTimer);
      setTypingTimer(setTimeout(() => {
          setTyping(false);
      }, 3000)); // 1 second delay
  };

  useEffect(() => {
    connectSocket.update_typing_status(conversation_id, typing);
  }, [typing]);

  useEffect(() => {
    const textarea = messageBox.current;
    textarea.addEventListener('keypress', handleKeyPress);
    textarea.addEventListener('keyup', handleKeyUp);

    return () => {
        textarea.removeEventListener('keypress', handleKeyPress);
        textarea.removeEventListener('keyup', handleKeyUp);
    };
}, [typingTimer]);

  async function handle_send(event) {
    // Checks if the enter key was pressed without the shift key
    if (event.key === 'Enter' && !event.shiftKey || event === true) {
      console.log('Enter was pressed without Shift!');
  
      const message = messageBox.current.value;
      messageBox.current.value = "Sending...";
      messageBox.current.disabled = true;
  
      // Send message
      const message_status = await connectSocket.send_message(message, conversation_id, messageDestruct);
  
      if (message_status === "message_sent") {
        // Tell the server the user is no longer typing
        connectSocket.update_typing_status(conversation_id, false);
        setMessageDestruct(null);
        messageBox.current.value = null;
        messageBox.current.disabled = false;
        messageBox.current.focus();
      }
    }
  }  

  useEffect(() => {
    // Only allows input if a conversation is selected
    if (conversation_id) {
      messageBox.current.disabled = false;
      sendButton.current.disabled = false;
    } else {
      messageBox.current.disabled = true;
      sendButton.current.disabled = true;
    }
  }, [conversation_id]);

  function handle_gif_panel() {
    if (conversation_id) {
      setShowGifSelector(!showGifSelector);
    }
  }
  
  return (
    <div className="messageSender">
      <TypingIndicator />
      <div className='message-box'>
        <textarea ref={messageBox} placeholder="Send a Message" onKeyDown={handle_send} id='message-box'rows="1" />
        <button className='gif-selector-button'>
          <span onClick={handle_gif_panel}>GIF</span>
          <GifSelector showGifSelector={showGifSelector} setShowGifSelector={setShowGifSelector} />
        </button>
        <button title='Self-Destruct Message'>
          <img src={messageDestructIconSrc} onClick={() => setShowSelector(!showSelector)} />
          <MessageDestructSelector 
            showSelector={showSelector}
            messageDestruct={messageDestruct}
            setMessageDestruct={setMessageDestruct}
            setShowSelector={setShowSelector}
          />
        </button>
        <button ref={sendButton} onClick={() => handle_send(true)}>
          <img src={Send_Button} />
        </button>
      </div>
    </div>
  );
}

// Main Component for this page
function MainPage() {
  const [friends, setFriends] = useState({});
  const [friendsListState, setFriendsListState] = useState('loading');

  useEffect(() => {
    async function getToken() {
      const token = localStorage.getItem('token');
      console.log("Token: " + token);
    }

    getToken();
  }, []);

  return (
    <div className="appContainer">
      <ReconnectingBar /> 
      <SideOptionsBar />
      <SideBar 
        friendsListState={friendsListState}
        setFriendsListState={setFriendsListState}
        friends={friends}
        setFriends={setFriends}
      />
      <div className="messagesContainer">
        <Messages 
          friendsListState={friendsListState}
          setFriendsListState={setFriendsListState}
        />
        <MessageSender />
      </div>
      <UpdateDownloaded />
    </div>
  );
}

export default MainPage;