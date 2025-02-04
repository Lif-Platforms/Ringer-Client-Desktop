import accept_icon from '../../assets/home/check_icon.svg';
import decline_icon from '../../assets/home/x_icon.svg';
import "../../css/main.css";
import loader from '../../assets/global/loaders/loader-2.svg';
import { useState } from 'react';

export default function FriendRequest({sender, id, remove_request}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handle_request(id, type) {
        setIsLoading(true);

        // Gets username and token
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
    
        // Create new formdata
        const formData = new FormData();
        formData.append("request_id", id);

        // Create url based on type
        const url = type === "accept" ? 
            `${process.env.REACT_APP_RINGER_SERVER_URL}/accept_friend_request` : 
            `${process.env.REACT_APP_RINGER_SERVER_URL}/deny_friend_request`;
    
        fetch(url, {
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
                return response.json();
            } else {
                throw new Error('Request failed with status code: ' + response.status);
            }
        })
        .then((data) => {
            // Remove request from list
            remove_request(id);

            // Update friends list
            const friend_request_accept_event = new CustomEvent("Friend_Request_Accept", {
                detail: {
                    username: data.name,
                    id: data.conversation_id,
                    user_online: data.sender_presence
                }
            });
            document.dispatchEvent(friend_request_accept_event);
        })
        .catch((error) => {
            setIsLoading(false);
            console.error(error);
        });
    }    

    return (
        <li className="request_item">
            {sender}
            {isLoading ? (
                <img className='loader' src={loader} alt='loading' />
            ): (
                <div className="request_buttons">
                    <button
                        className='acceptButton'
                        onClick={() => handle_request(id, "accept")}
                    >
                        <img src={accept_icon} alt='accept' />
                    </button>
                    <button
                        className='denyButton'
                        onClick={() => handle_request(id, "deny")}
                    >
                        <img src={decline_icon} alt='deny' />
                    </button>
                </div>
            )}
        </li>
    );
}