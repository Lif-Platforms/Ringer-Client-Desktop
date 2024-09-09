import { useParams, useNavigate } from "react-router-dom";

export default function UnfriendUser({
    unfriendState,
    setUnfriendState,
    friendsListState,
    setFriendsListState,
  }) {
    const { conversation_id } = useParams();
  
    const navigate = useNavigate();
  
    // Handle the unfriending process
    async function handle_unfriend() {
      // Set popup state
      setUnfriendState('loading');
  
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
            // Make clone of friends list
            let friends_list = [...friendsListState];
  
            // Keep track of array index
            let index = 0;
  
            // Remove conversation from friends list
            friends_list.forEach((conversation) => {
              if (conversation.Id === conversation_id) {
                friends_list.splice(index, 1);
  
              } else {
                index += 1;
              }
            });
  
            // Update friends list
            setFriendsListState(friends_list);
  
            // Set elected conversation
            navigate('/direct_messages');
  
            setUnfriendState("completed");
          } else {
            throw new Error('Request failed with status code: ' + response.status);
          }
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });
    }
  
    if (unfriendState !== "hide" && unfriendState !== "loading" && unfriendState !== "completed") {
      return(
        <div className='unfriend-popup'>
          <h1>Unfriend {unfriendState}?</h1>
          <p>You will no longer be able to send or receive messages from this person.</p>
          <div>
            <button id='unfriend-button' onClick={handle_unfriend}>Yes, Do it!</button>
            <button id='unfriend-cancel-button' onClick={() => setUnfriendState('hide')}>No, Don't!</button>
          </div>
        </div>
      )
    } else if (unfriendState === "loading") {
      return(
        <div className='unfriend-popup'>
          <div className="lds-ellipsis">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      )
    } else if (unfriendState === "completed") {
      return(
        <div className='unfriend-popup'>
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h1>Successfully Unfriended User</h1>
            <button onClick={() => setUnfriendState('hide')}>Close</button>
        </div>
      )
    }
  }