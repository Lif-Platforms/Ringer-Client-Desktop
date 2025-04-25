import { useEffect, useState } from 'react';
import add_button from '../../../assets/home/add_icon.png';
import loader from '../../../assets/global/loaders/loader-2.svg';
import check_icon from '../../../assets/home/check-icon.svg';
import styles from './styles.module.css';

export default function FriendSearchResult({ username, setErrorText }) {
    const [isLoading, setIsLoading] = useState(false);
    const [buttonImageSrc, setButtonImageSrc] = useState(add_button);
    const [userAdded, setUserAdded] = useState(false);

    return (
        <div className={styles.result}>
            <div className={styles.userInfo}>
                <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${username}.png`} />
                <h2>{username}</h2>
            </div>
            <button disabled={isLoading} className={styles.addButton}>
                <img src={buttonImageSrc} />
            </button>
        </div>
    )
}