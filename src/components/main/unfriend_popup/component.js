import styles from './styles.module.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
import { PopupContext } from 'src/providers/popup';
import Loader from '../../../assets/global/loaders/loader-2.svg';

export default function UnfriendPopup({ username }) {
    const [unfriendState, setUnfriendState] = useState('default');
    const [isLoading, setIsLoading] = useState(false);

    const { conversation_id } = useParams();
    const navigate = useNavigate();

    const { closePopup } = useContext(PopupContext);

    async function handle_unfriend() {
        // Set popup state
        setUnfriendState('loading');
        setIsLoading(true)
    
        // Get client auth info
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
    
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/remove_conversation/${conversation_id}`, {
          headers: {
            username: username,
            token: token
          },
          method: "DELETE"
        })
          .then(response => {
            if (response.ok) {
              // Send send an event to remove the conversation from the list
              const event = new CustomEvent('Conversation_Removal', { detail: {
                id: conversation_id
              } });
              document.dispatchEvent(event);
    
              // Set elected conversation
              navigate('/direct_messages');
    
              closePopup();
            } else {
              throw new Error('Request failed with status code: ' + response.status);
            }
          })
          .catch(error => {
            // Handle any errors
            console.error(error);
            setIsLoading(false);
          });
    }

    return (
        <div className={styles.unfriendPopup}>
            <p>Are your sure you want to unfriend <b>{username}</b>? You will no longer be able to send or receive messages from this person.</p>
            <div className={styles.buttonContainer}>
                <button style={{backgroundColor: "red"}} onClick={handle_unfriend}>
                  {isLoading ? (
                    <img src={Loader} />
                  ): ("Yes, Do It!")}
                </button>
                <button onClick={closePopup}>No, Don't!</button>
            </div>
        </div>
    )
}