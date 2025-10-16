import { useState } from 'react';
import add_button from '../../../assets/home/add_icon.png';
import loader from '../../../assets/global/loaders/loader-2.svg';
import check_icon from '../../../assets/home/check-icon.svg';
import styles from './styles.module.css';

export default function FriendSearchResult({ username, setErrorText }) {
    const [isLoading, setIsLoading] = useState(false);
    const [buttonImageSrc, setButtonImageSrc] = useState(add_button);

    function handle_add() {
        setIsLoading(true);
        setButtonImageSrc(loader);
        setErrorText("");

        // Get auth credentials
        const user = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        // Create formdata for request
        const formData = new FormData();
        formData.append('recipient', username);

        // Make add request
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/add_friend`, {
            method: 'POST',
            headers: {
                username: user,
                token: token
            },
            body: formData
        })
        .then((response) => {
            setIsLoading(false);
            setButtonImageSrc(add_button);

            if (response.ok) {
                setButtonImageSrc(check_icon);
            } else if (response.status === 409) {
                setErrorText("Already outgoing request.");
            } else {
                throw new Error(`Request failed with status code: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error(error);
            setIsLoading(false);
            setErrorText("Something went wrong.");
        })
    }

    return (
        <div className={styles.result}>
            <div className={styles.userInfo}>
                <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${username}.png`} />
                <h2>{username}</h2>
            </div>
            <button 
                disabled={isLoading}
                className={styles.addButton}
                onClick={handle_add}
            >
                <img src={buttonImageSrc} />
            </button>
        </div>
    )
}