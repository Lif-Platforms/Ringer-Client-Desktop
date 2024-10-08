import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"

export default function Friend({ username, online, id, selected_conversation, last_message}) {
    const navigate = useNavigate();
    const friendsRef = useRef();

    // Add active class based on selected conversation
    useEffect(() => {
        if (selected_conversation === id) {
            friendsRef.current.classList.add('active');
        } else {
            friendsRef.current.classList.remove('active');
        }
    }, [selected_conversation]);

    return (
        <div className="friends" ref={friendsRef} onClick={() => navigate(`/direct_messages/${id}`)}>
            <div style={{position: 'relative'}}>
                <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${username}.png`} alt="Profile" />
                <div className={`user-online-status ${online ? 'online' : ''}`} />
            </div>
            <div className="username_section">
                <span className="username">{username}</span>
                {last_message ? (
                    <span title={last_message} className="last_message">{last_message}</span>
                ): null} 
            </div>
        </div>
    )
}