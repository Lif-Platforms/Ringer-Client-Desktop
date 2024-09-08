import FriendsList from "./friends_list";
import Add_Icon from '../../assets/home/add_icon.png';
import { useState } from "react";
import AddNewConversationMenu from "./add_new_conversation_menu";

export default function SideBar({ friendsListState, setFriendsListState }) {
    const [showPopup, setShowPopup] = useState(false);
  
    const handleButtonClick = () => {
      setShowPopup(true);
    };
  
    const handleClosePopup = () => {
      setShowPopup(false);
    };
  
    return (
      <div className="sideBar">
        <div className="sidebarHeader">
          <h1>Direct Messages</h1>
          <button onClick={handleButtonClick} className='addFriendButton'>
            <img src={Add_Icon} />
          </button>
          {showPopup && <AddNewConversationMenu onClose={handleClosePopup} />}
        </div>
        <FriendsList 
          friendsListState={friendsListState} 
          setFriendsListState={setFriendsListState} 
        />
      </div>
    );   
  }