import styles from './styles.module.css';
import unfriend_icon from '../../../assets/home/unfriend_button.svg';
import InfoSidebarButton from '../info_sidebar_button/component';
import { useEffect, useContext } from 'react';
import { InfoSidebarContext } from 'src/providers/info_sidebar';
import { PopupContext } from 'src/providers/popup';
import UnfriendPopup from '../unfriend_popup/component';

export default function ConversationHeader({
    conversationName,
    setUnfriendState,
}) {
    // Access the info sidebar context
    const { setInfoSidebarUsername } = useContext(InfoSidebarContext);

    // Update the conversation name in the side bar
    useEffect(() => {
        setInfoSidebarUsername(conversationName);
    }, [conversationName, setInfoSidebarUsername]);

    // Access the popup context
    const { showPopup } = useContext(PopupContext);

    return (
        <div className={styles.conversationHeader}>
            <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/v1/get_avatar/${conversationName}.png`} alt="Avatar" draggable="false" />
            <h1>{conversationName}</h1>
            <div className={styles.controls}>
                <button title="Unfriend" onClick={() => showPopup(
                    'Unfriend User',
                    'center',
                    <UnfriendPopup username={conversationName} />
                )}>
                    <img src={unfriend_icon} alt='' />
                </button>
                <InfoSidebarButton username={conversationName} />
            </div>
        </div>
    )
}