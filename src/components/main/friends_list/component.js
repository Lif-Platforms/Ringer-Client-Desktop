import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Error_Image from '../../../assets/global/Error.png';
import Friend from "../friend";
import styles from './styles.module.css';

export default function FriendsList({
    friendsListState,
    setFriendsListState,
}) {
    const navigate = useNavigate();
  
    const { conversation_id } = useParams();
  
    function handle_friend_request_accept(data) {
      if (friendsListState !== "loading" && typeof friendsListState === "object") {
        // Create clone of friends list
        let friendsList = [...friendsListState];
  
        let user_found = false;
  
        // Check if user is already in list
        friendsList.forEach((user) => {
          if (user.Username === data.detail.username) {
            user_found = true;
            console.log("found user");
          }
        });
  
        if (!user_found) {
          friendsList.push({
            Username: data.detail.username,
            Id: data.detail.id,
            Online: data.detail.user_online,
            Last_Message: "This is a new conversation!"
          });
  
          // Update friends list
          setFriendsListState(friendsList);
        }
      } else if (friendsListState !== "loading" && typeof friendsListState !== "object") {
        // Set new friends list
        setFriendsListState([{Username: data.detail.username, Id: data.detail.id}]);
      }
    }
  
    function handle_conversation_removal(data) {
      // Create clone of friends list
      let friendsList = [...friendsListState];
  
      // Keep track of conversation index
      let index = 0;
  
      // Check if conversation exists
      friendsList.forEach((conversation) => {
        if (conversation.Id === data.detail.id) {
          console.log("found conversation")
          friendsList.splice(index, 1);
  
        } else {
          index += 1;
        }
      })
  
      // Update friends list
      setFriendsListState(friendsList);
  
      // Check if removed conversation is currently selected
      if (data.detail.id === conversation_id) {
        navigate("/direct_messages");
      }
    }
  
    function handle_user_status_update(data) {
      console.log(data.detail.user + " is now " + data.detail.status);
  
      // Make a copy of the friends list to modify
      let friendsList = [...friendsListState];
  
      // Cycle through the list and update the users online status
      friendsList.forEach(friend => {
        if (friend.Username === data.detail.user) {
          friend.Online = data.detail.status;
        }
      })
  
      // Update friends list state with new friends list
      setFriendsListState(friendsList);
    }
  
    document.addEventListener("Friend_Request_Accept", handle_friend_request_accept);
    document.addEventListener("Conversation_Removal", handle_conversation_removal);
    document.addEventListener("User_Status_Update", handle_user_status_update);
    
    useEffect(() => {
      // Remove event listener on component unmount
      return () => {
        document.removeEventListener("Friend_Request_Accept", handle_friend_request_accept);
        document.removeEventListener("Conversation_Removal", handle_conversation_removal);
        document.removeEventListener("User_Status_Update", handle_user_status_update);
      }
    }, []);
  
    // Fetch friends list from server
    useEffect(() => {
      async function get_friends() {
        // Gets username and token
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
  
        console.log("Request Username: " + username);
        console.log("Request Token: " + token);
  
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/get_friends`, {
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
  
          if ("ERROR_CODE" in data) {
            setFriendsListState("Error");
          } else {
            setFriendsListState(data);
          }
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });
      }
      if (friendsListState === "loading") {
        get_friends();
      }
    }, [friendsListState]);

    // Update most recent message upon message update
    function handle_message_update(data) {
      console.log(data.detail.message);

      // Make a copy of the friends list to modify
      let friendsList = [...friendsListState];

      friendsList.forEach((user) => {
        if (user.Id === data.detail.conversation_id) {
          user.Last_Message = data.detail.message;
        }
      });

      setFriendsListState(friendsList);
    }

    // Listen for message updates and update the friends list
    document.addEventListener("Message_Update", handle_message_update);

    // Remove event listener upon unmount
    useEffect(() => {
      return () => {
        document.removeEventListener("Message_Update", handle_message_update);
      }
    }, []);
  
    if (friendsListState === "loading") {
      return(
        <div className={styles.friendsList}>
          <div className="loader">
            <div className="avatar" />
            <div className="username" />
          </div>
          <div className="loader">
            <div className="avatar" />
            <div className="username" />
          </div>
          <div className="loader">
            <div className="avatar" />
            <div className="username" />
          </div>
        </div>
      )
    } else if (friendsListState === "Error"){
      return(
        <div className={styles.friendsList}>
          <img src={Error_Image} alt='Error' className='error_image' />
          <p>Something Went Wrong!</p>
        </div>
      )
    } else if (Array.isArray(friendsListState)) {
      return(
          <div className={styles.friendsList}>
            {friendsListState.map(item => (
                <Friend
                  username={item.Username}
                  id={item.Id}
                  online={item.Online}
                  last_message={item.Last_Message}
                  selected_conversation={conversation_id}
                />
            ))}
          </div> 
      );
    }
  }