import { useState, useEffect } from "react";
import Error_Image from '../../assets/global/Error.png';

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

  async function handleAccept(request) {
    // Gets username and token
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // Create new formdata
    const formData = new FormData();
    formData.append("user", request);

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/accept_friend_request`, {
      headers: {
        username: username,
        token: token
      },
      method: "POST",
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // Reset popup status and close popup
        setFriendsListState("loading")
        onClose();
      } else {
        throw new Error('Request failed with status code: ' + response.status);
      }
    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
  }

  async function handleDeny(request) {
    // Gets username and token
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // Create new form data
    const formData = new FormData();
    formData.append("user", request);

    fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/deny_friend_request`, {
      headers: {
        username: username,
        token: token
      },
      method: "POST",
      body: formData
    })
    .then(response => {
      if (response.ok) {
        onClose();
      } else {
        throw new Error('Request failed with status code: ' + response.status);
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
      </div>
    )
  }
}