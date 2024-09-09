import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfilePopUp from "./profile_popup";
import CheckLinkPopup from "./check_link_popup";
import connectSocket from "../../Scripts/mainPage/notification_conn_handler";
import UnfriendUser from "./unfriend_user";

export default function Messages({ friendsListState, setFriendsListState }) {
    const [messages, setMessages] = useState('loading');
    const [unfriendState, setUnfriendState] = useState('hide');
    const [showPopup, setShowPopup] = useState(false);
    const [popupUsername, setPopupUsername] = useState();
    const [checkLinkPopup, setCheckLinkPopup] = useState(false);
    const [conversationName, setConversationName] = useState();
  
    const { conversation_id } = useParams();
  
    // Allow messages to be changed during the runtime of the socket function
    const messagesRef = useRef(messages);
  
    // Allow the conversation id to be changed during the runtime of the socket function
    const conversationIdRef = useRef(conversation_id);
  
    // Reset the conversation name once the id changes
    useEffect(() => {
      setConversationName(null);
    }, [conversation_id])
  
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
      conversationIdRef.current = conversation_id;
      console.log("Updated conversation id: ", conversationIdRef.current);
    }, [conversation_id])
  
    // Start websocket connection to notification server
    useEffect(() => {
      connectSocket(conversationIdRef, messagesRef, setMessages);
      
      return () => {
        connectSocket.close_conn();
      }
    }, []);
     
    // Load messages
    useEffect(() => {
      console.log("Selected Conversation: " + conversation_id)
      async function handle_message_load() {
        // Get auth data
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
  
        // Change the message container to loading
        setMessages('loading');
  
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/load_messages/${conversation_id}`, {
          headers: {
            username: username,
            token: token,
            version: "2.0"
          }
        })
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
          setMessages(data.messages);
          setConversationName(data.conversation_name);
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });
      }
      // Only load messages if there is a conversation selected
      if (conversation_id !== undefined) {
        handle_message_load();
      } else {
        setMessages(null);
      }
    }, [conversation_id]);
  
    function handle_open_popup(username) {
      // Set popup username
      setPopupUsername(username);
  
      // Open popup
      setShowPopup(true);
    }
  
    function handle_link_click(url) {
      setCheckLinkPopup(url);
    }
  
    const renderMessageContent = (message) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = message.split(urlRegex);
  
      return parts.map((part, index) => {
        if (urlRegex.test(part)) {
          // If part is a URL, wrap it in an anchor tag
          return (
            <a key={index} onClick={() => handle_link_click(part)}>
              {part}
            </a>
          );
        } else {
          // Otherwise, render plain text
          return <span key={index}>{part}</span>;
        }
      });
    };
  
    return (
      <div className="messages">
        {conversationName && (
          <div className='conversationHeader'>
            <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${conversationName}.png`} alt="Avatar" draggable="false" className='selectedConversationAvatar' />
            <h1>{conversationName}</h1>  
            <button className='unfriend-button' title="Unfriend" onClick={() => setUnfriendState(conversationName)}>&#10006;</button>
          </div>
        )}
        {messages === 'loading' ? (
          <div className="messages-loader">
            <div className="header">
              <div className="avatar" />
              <div className="username" />
            </div>
            <div className="messages">
              <div className="message">
                <div className="avatar" />
                <div className="text">
                  <div className="line1" />
                  <div className="line2" />
                </div>
              </div>
              <div className="message">
                <div className="avatar" />
                <div className="text">
                  <div className="line1" />
                  <div className="line2" />
                </div>
              </div>
              <div className="message">
                <div className="avatar" />
                <div className="text">
                  <div className="line1" />
                  <div className="line2" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          typeof messages === 'object' && messages !== null ? (
            <div className='message-container' id='message-container'>
              {messages.map((message, index) => (
                <div key={index} className='message'>
                  <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${message.Author}.png`} alt='' onClick={() => handle_open_popup(message.Author)} />
                  <div>
                    <h1>{message.Author}</h1>
                    <p>{renderMessageContent(message.Message)}</p>
                  </div>
                </div>
              ))}
              <ProfilePopUp
                showPopup={showPopup}
                profileInfo={popupUsername}
                setShowPopup={setShowPopup}
                popupUsername={popupUsername}
              />
              <CheckLinkPopup 
                checkLinkPopup={checkLinkPopup}
                setCheckLinkPopup={setCheckLinkPopup}
              />
            </div>
          ) : (
            <h1>Nothing to see here...</h1>
          )
        )}
        <UnfriendUser 
          unfriendState={unfriendState}
          setUnfriendState={setUnfriendState}
          friendsListState={friendsListState} 
          setFriendsListState={setFriendsListState}
        />
      </div>
    );
  }