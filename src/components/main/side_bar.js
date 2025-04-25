import FriendsList from "./friends_list";
import Add_Icon from '../../assets/home/add_icon.png';
import { PopupContext } from "src/providers/popup";
import { useContext } from "react";
import AddUserSearch from "./add_user_search/component";

export default function SideBar({ friendsListState, setFriendsListState }) {
    const { showPopup } = useContext(PopupContext);
  
    return (
      <div className="sideBar">
        <div className="sidebarHeader">
          <h1>Direct Messages</h1>
          <button onClick={() => showPopup(
            "Add Friend",
            "center",
            <AddUserSearch />
          )} className='addFriendButton'>
            <img src={Add_Icon} />
          </button>
        </div>
        <FriendsList 
          friendsListState={friendsListState} 
          setFriendsListState={setFriendsListState} 
        />
      </div>
    );   
  }