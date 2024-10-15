import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfilePopUp from "./profile_popup";
import CheckLinkPopup from "./check_link_popup";
import connectSocket from "../../Scripts/mainPage/notification_conn_handler";
import UnfriendUser from "./unfriend_user";
import Clock from '../../assets/home/clock_icon.png';
import GIPHY_LOGO from '../../assets/home/GIPHY_attrabution.png';
import Spinner from '../../assets/global/loaders/loader-1.svg';
import ReturnToRecent from "./go_to_recent";

export default function Messages({ friendsListState, setFriendsListState }) {
    const [messages, setMessages] = useState('loading');
    const [unfriendState, setUnfriendState] = useState('hide');
    const [showPopup, setShowPopup] = useState(false);
    const [popupUsername, setPopupUsername] = useState();
    const [checkLinkPopup, setCheckLinkPopup] = useState(false);
    const [conversationName, setConversationName] = useState();
    const [isLoadingAdditionalMessages, setIsLoadingAdditionalMessages] = useState(false);
    const loadAdditionalMessages = useRef(false);
    const initialLoad = useRef(true);
    const messages_container = useRef();
    const reset_scroll = useRef(true);
    const previous_scroll_position = useRef();

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
  
        // Scroll to the bottom of the message
        let messages_div = document.getElementById("message-container");
        if (messages_div && reset_scroll.current) {
          messages_div.scrollTop = messages_div.scrollHeight;
        } else {
          reset_scroll.current = true;

          // Keep scroll position the same if reset scroll is false
          if (previous_scroll_position.current && messages_div) {
            const new_scroll_position = messages_div.scrollHeight - previous_scroll_position.current - 100;
            messages_div.scrollTop = new_scroll_position;
          }
        }

        if (initialLoad.current) {
          if (messages && messages.length >= 20) {
            loadAdditionalMessages.current = true;
          } else {
            loadAdditionalMessages.current = false;
          }

          initialLoad.current = false;
        }
      }
    }, [messages]);
  
    useEffect(() => {
      conversationIdRef.current = conversation_id;
      console.log("Updated conversation id: ", conversationIdRef.current);

      // Reset initial load for next conversation
      initialLoad.current = true;
    }, [conversation_id])
  
    // Start websocket connection to notification server
    useEffect(() => {
      connectSocket(conversationIdRef, messagesRef, setMessages);
      
      return () => {
        connectSocket.close_conn();
      }
    }, []);

    function handle_message_delete(data) {
      console.log(data.detail.conversation_id);
      if (data.detail.conversation_id === conversationIdRef.current) {
        // Make a clone of messages to work with
        let messages_ = [...messagesRef.current];

        console.log(data.detail.message_id);

        // Delete message from conversation
        const new_messages = messages_.filter(message => message.Id !== data.detail.message_id);
        setMessages(new_messages);
        console.log("Deleted message");
      } else {
        console.log("conversation id did not match")
      }
    }
    useEffect(() => {
      document.addEventListener('Delete_Message', handle_message_delete);

      return () => {
        document.removeEventListener('Delete_Message', handle_message_delete);
      }
    }, [])
     
    // Load messages
    useEffect(() => {
      console.log("Selected Conversation: " + conversation_id)
      async function handle_message_load() {
        // Get auth data
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        // Reset additional message loader
        setIsLoadingAdditionalMessages(false);
  
        // Change the message container to loading
        setMessages('loading');
  
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/load_messages/${conversation_id}?offset=0`, {
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

    useEffect(() => {
      if (messages !== 'loading' && messages !== null) {
        const messages_container = document.getElementById('message-container');

        const handleScrollEnd = () => {
          const scrollPosition = messages_container.scrollTop;
          console.log("load more messages: " + loadAdditionalMessages.current)
          if (scrollPosition === 0 && loadAdditionalMessages && loadAdditionalMessages.current) {
              previous_scroll_position.current = messages_container.scrollHeight;

              setIsLoadingAdditionalMessages(true);

              // Make a copy of messages to work with
              let new_messages = [...messages]

              fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/load_messages/${conversationIdRef.current}?offset=${messages.length}`, {
                headers: {
                  username: localStorage.getItem('username'),
                  token: localStorage.getItem('token')
                }
              })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Request failed with status code: ' + response.status);
                }
              })
              .then((data) => {
                setIsLoadingAdditionalMessages(false);

                // Disable scroll reset during the loading of additional messages
                reset_scroll.current = false;

                new_messages.unshift(...data);
                setMessages(new_messages);

                if (data.length < 20) {
                  loadAdditionalMessages.current = false;
                }
              })
              .catch((error) => {
                setIsLoadingAdditionalMessages(false);
                console.error(error);
              })
          }
        };
      
        messages_container.addEventListener('scrollend', handleScrollEnd);

        return () => {
          messages_container.removeEventListener('scrollend', handleScrollEnd);
        }
      }
    }, [messages]);
  
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
            <div className='message-container' id='message-container' ref={messages_container}>
              {isLoadingAdditionalMessages ? (
                <img src={Spinner} />
              ): null}
              {messages.map((message, index) => (
                <div key={index} className='message'>
                  <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${message.Author}.png`} alt='' onClick={() => handle_open_popup(message.Author)} />
                  <div>
                    <div className="message-header">
                      <h1>{message.Author}</h1>
                      {message.Self_Destruct && message.Self_Destruct !== "False" ? <img title="This message will self-destruct after viewing." src={Clock} className="clock" /> : null}
                    </div>
                    {message.Message_Type === "GIF" ? (
                      <>
                        <img className="message-gif" src={message.GIF_URL} alt={message.Message} />
                        <img className="giphy-logo" src={GIPHY_LOGO} />
                      </>
                    ) : (
                      <p>{renderMessageContent(message.Message)}</p>
                    )}
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
        <ReturnToRecent messages_container={messages_container} />
        <UnfriendUser 
          unfriendState={unfriendState}
          setUnfriendState={setUnfriendState}
          friendsListState={friendsListState} 
          setFriendsListState={setFriendsListState}
        />
      </div>
    );
  }