import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Clock from '../../assets/home/clock_icon.png';
import Clock_Active from '../../assets/home/clock_icon_active.png';
import connectSocket from "../../Scripts/mainPage/notification_conn_handler";
import TypingIndicator from "./typing_indicator";
import GifSelector from "./gif_selector";
import MessageDestructSelector from "./message_destruct_selector";
import Send_Button from '../../assets/home/send_button.svg';

export default function MessageBox({ setIsSending, messages, setMessages }) {
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

    // Listen for and handle resend event
    useEffect(() => {
        async function handle_resend(event) {
            setIsSending(true);
            messageBox.current.value = null;
            messageBox.current.disabled = true;

            // Send message
            const message_status = await connectSocket.send_message(event.detail.content, conversation_id, event.detail.self_destruct);

            if (message_status === "message_sent") {
                messageBox.current.disabled = false;
                setIsSending(false);
            } else if (message_status === "failed_to_send") {
                messageBox.current.disabled = false;
                setIsSending(false);

                // Add message to list
                let messages_copy = [...messages];

                messages_copy.push({
                    Author: localStorage.getItem('username'),
                    Message: event.detail.content,
                    Message_Id: event.detail.id,
                    SelfDestruct: event.detail.self_destruct,
                    FailedToSend: true
                });

                setMessages(messages_copy);
            }
        }

        document.addEventListener("resend_message", handle_resend);
    }, [])

    async function handle_send(event) {
        // Checks if the enter key was pressed without the shift key
        if (event.key === 'Enter' && !event.shiftKey || event === true) {
            setIsSending(true);
        
            const message = messageBox.current.value;
            messageBox.current.value = null;
            messageBox.current.disabled = true;

            // Tell the server the user is no longer typing
            connectSocket.update_typing_status(conversation_id, false);
        
            // Send message
            const message_status = await connectSocket.send_message(message, conversation_id, messageDestruct);
        
            if (message_status === "message_sent") {
                setMessageDestruct(null);
                messageBox.current.disabled = false;
                messageBox.current.focus();
                setIsSending(false);
            } else if (message_status === "failed_to_send") {
                setMessageDestruct(null);
                messageBox.current.disabled = false;
                messageBox.current.focus();
                setIsSending(false);

                // Generate message id for message
                const message_id = String(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);

                // Add message to list
                let messages_copy = [...messages];

                messages_copy.push({
                    Author: localStorage.getItem('username'),
                    Message: message,
                    Message_Id: message_id,
                    SelfDestruct: messageDestruct,
                    FailedToSend: true
                });

                setMessages(messages_copy);
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