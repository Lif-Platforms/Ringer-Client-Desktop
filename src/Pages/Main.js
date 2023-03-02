// Import Files
import '../App.css';
import '../css/main.css';
import profile from '../Images/profile_placeholder.png'
// Import Modules
import React from "react";

// Component for direct message side bar
class SideBar extends React.Component {
    render() {
        return(
            <div className='sideBar'>
                <div className='sidebarHeader'>
                    <h1>Direct Messages</h1>
                </div>
            </div>
        );
    }
}

// Component for user profile
class UserProfile extends React.Component {
    render() {
        return(
            <div className='userProfile'>
                <div className='avatar'>
                    <img src={profile} alt="Avatar" draggable="false" />
                </div>
                <div>
                    <h1>Username</h1>
                </div>
            </div>
        );
    }
}

// Component for messages
class Messages extends React.Component {
    render() {
        return(
            <div className='messages'></div>
        );
    }
}

// Component for text input
class MessageSender extends React.Component {
    render() {
        return(
            <div className='messageSender'>
                <input placeholder='Send a Message'></input>
            </div>
        );
    }
}

function MainPage() {
    return(
        <div className='appContainer'>
            <div>
                <SideBar />
                <UserProfile />
            </div>
            <div className='messagesContainer'>
                <Messages />
                <MessageSender />
            </div>
        </div>
    );
}

export default MainPage;