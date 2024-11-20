// Import Files
import '../App.css';
import '../css/main.css';
import '../css/Animations/checkmark.css';
import { log_out } from '../Scripts/utils/user-log-out';
import SideOptionsBar from 'src/components/main/side_options_menu';
import SideBar from 'src/components/main/side_bar';
import Messages from 'src/components/main/messages';
import React, { useState, useEffect, useRef } from 'react';
import MessageBox from 'src/components/main/message_box';
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

// Main Component for this page
function MainPage() {
  const [friends, setFriends] = useState({});
  const [friendsListState, setFriendsListState] = useState('loading');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState('loading');

  // Allow messages to be changed during the runtime of the socket function
  const messagesRef = useRef(messages);

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
          isSending={isSending}
          setMessages={setMessages}
          messages={messages}
          messagesRef={messagesRef}
        />
        <MessageBox 
          setIsSending={setIsSending}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
      <UpdateDownloaded />
    </div>
  );
}

export default MainPage;