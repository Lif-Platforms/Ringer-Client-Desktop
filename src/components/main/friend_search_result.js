import { useEffect, useState } from 'react';
import add_button from '../../assets/home/add_icon.png';
import loader from '../../assets/global/loaders/loader-2.svg';
import check_icon from '../../assets/home/check-icon.svg';

export default function FriendSearchResult({ username, disabled, setDisabled, setErrorText }) {
    const [isLoading, setIsLoading] = useState(false);
    const [buttonImageSrc, setButtonImageSrc] = useState(add_button);
    const [userAdded, setUserAdded] = useState(false);

    function handle_add() {
        setIsLoading(true);
        setDisabled(true);

        const token = localStorage.getItem('token');
        const username_ = localStorage.getItem('username');

        // Create new form data for request
        const formData = new FormData();
        formData.append("recipient", username);

        // Reset error text
        setErrorText("");

        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/add_friend`, {
            headers: {
              username: username_,
              token: token
            },
            method: "POST",
            body: formData
          }
        )
        .then(response => {
          if (response.ok) {
            setIsLoading(false);
            setDisabled(false);
            setUserAdded(true);
          } else if (response.status === 409) {
            setIsLoading(false);
            setDisabled(false);
            setErrorText("You already sent a friend request to this user.");
          } else if (response.status === 404) {
            setIsLoading(false);
            setDisabled(false);
            setErrorText("This user doesn't exist.");
          } else {
            throw new Error('Request failed with status code: ' + response.status);
          }
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
          setErrorText("Something went wrong!");
        });
    }

    useEffect(() => {
        if (isLoading) {
            setButtonImageSrc(loader);
        } else if (userAdded) {
            setButtonImageSrc(check_icon);
        } else {
          setButtonImageSrc(add_button);
        }
    }, [isLoading, userAdded]);

    return (
        <div className="friend">
            <div className="info">
                <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${username}.png`} />
                <h2>{username}</h2>
            </div>
            <button onClick={handle_add} disabled={disabled} className="add-button">
                <img src={buttonImageSrc} />
            </button>
        </div>
    )
}