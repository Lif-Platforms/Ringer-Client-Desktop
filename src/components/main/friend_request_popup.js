import { useState, useEffect } from "react";
import Error_Image from '../../assets/global/Error.png';
import FriendRequest from "./friend_request";

export default function FriendRequestsPopup({ onClose, setFriendsListState }) {
  const [notificationData, setNotificationData] = useState('loading');

  useEffect(() => {
    async function fetchData() {
      // Gets username and token
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/get_friend_requests`, {
        headers: {
          username: username,
          token: token
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
        console.log(typeof data);

        setNotificationData(data);

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

  function remove_request(id) {
    // Make copy of notificationData
    let newNotificationData = [...notificationData];

    // Remove request from data
    newNotificationData = newNotificationData.filter(item => item.Request_Id !== id);

    // Update notificationData
    setNotificationData(newNotificationData);
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
              <FriendRequest
                sender={item.Sender}
                id={item.Request_Id}
                remove_request={remove_request}
                key={item.Request_Id}
              />
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
      </div>
    )
  }
}