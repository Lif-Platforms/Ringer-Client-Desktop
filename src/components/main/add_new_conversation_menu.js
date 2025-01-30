import { useRef, useState } from "react";
import loader from '../../assets/global/loaders/loader-2.svg';

export default function AddNewConversationMenu(props) {
  const [conversationState, setConversationState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userInputRef = useRef();

  const handleClose = () => {
    props.onClose();
  };

  // Function for handling adding conversations
  async function handleAddConversation() {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Get add user from input
    const add_user = userInputRef.current.value;

    // Create new formdata for request
    const formData = new FormData();
    formData.append("recipient", add_user);

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/add_friend`, {
      headers: {
        username: username,
        token: token
      },
      method: "POST",
      body: formData
    })
    .then((response) => {
      setIsLoading(false);

      if (response.ok) {
        setConversationState("sent");
      } else if (response.status === 409) {
        setConversationState("conflict");
      } else {
        throw new Error('Request failed with status code: ' + response.status);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle any errors
      setConversationState("error");
    });
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={handleClose}>
          &times;
        </span>
        {conversationState === "sent" ? (
          <>
            <h3>Request Sent!</h3>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </>
        ) : conversationState === "conflict" ? (
          <>
            <h3>Already Outgoing Request</h3>
            <p>You already have an outgoing request to this user.</p>
            <button className="accept_button" onClick={handleClose}>Ok</button>
          </>
        ) : conversationState === "error" ? (
          <>
            <h3>Error</h3>
            <p>There was an error when trying to add this user.</p>
            <button className="accept_button" onClick={handleClose}>Ok</button>
          </>
        ) : (
          <>
            <h3>Add Friend</h3>
            <input
              placeholder='Example: RingerBot123'
              ref={userInputRef}
              disabled={isLoading}
            />
            <br />
            <br />
            <span
              className='addConversation'
              onClick={handleAddConversation}
              disabled={isLoading}
            >
              {isLoading ? (
                <img src={loader} alt="loading" className="loader" />
              ) : "Add"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}