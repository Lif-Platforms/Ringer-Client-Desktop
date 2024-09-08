import { useState } from 'react';
import Direct_Messages from '../../assets/home/direct_messages.svg';
import AccountPanel from './account_panel';
import FriendRequestsPopup from './friend_request_popup';
import notification from '../../assets/home/Notification.png';

export default function SideOptionsBar({ setFriendsListState }) {
    const [accountPanelShow, setAccountPanelShow] = useState(false);
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);

    const handleCloseNotificationPopup = () => {
        setShowNotificationPopup(false);
    };

    const handleNotificationButtonClick = () => {
        setShowNotificationPopup(true);
    };

    return (
        <div className="side-options-menu">
            <img src={Direct_Messages} />
            <div style={{'position': 'relative'}}>
                <img onClick={handleNotificationButtonClick} className='notificationButton' src={notification} alt="notification"/>
                <img onClick={() => setAccountPanelShow(!accountPanelShow)} className='avatar' src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${window.localStorage.getItem('username')}.png`} />
                <AccountPanel accountPanelShow={accountPanelShow} />
                {showNotificationPopup && <FriendRequestsPopup onClose={handleCloseNotificationPopup} setFriendsListState={setFriendsListState} />}
            </div>
        </div>
    )
}