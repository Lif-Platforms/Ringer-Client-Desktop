import { useState } from "react";

export default function AddNewConversationMenu(props) {
    const [conversationAdded, setConversationAdded] = useState(false);
  
    const handleClose = () => {
      props.onClose();
    };
  
    // Function for handling adding conversations
    async function handleAddConversation(add_user) {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
  
        // Create new formdata for request
        const formData = new FormData();
        formData.append("user", add_user);
  
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/add_friend`, {
            headers: {
              username: username,
              token: token
            },
            method: "POST",
            body: formData
          }
        )
        .then(response => {
          if (response.ok) {
            setConversationAdded(true);
          } else {
            throw new Error('Request failed with status code: ' + response.status);
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