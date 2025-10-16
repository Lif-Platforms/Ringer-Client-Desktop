import { useState, useEffect, useContext } from "react";
import Shield_1 from '../../../assets/home/Shield_1.png';
import Shield_2 from '../../../assets/home/Shield_2.png';
import Blocked_Icon from '../../../assets/home/Blocked_Icon.png';
import Shield_3 from '../../../assets/home/Shield_3.png';
import Loader_1 from '../../../assets/global/loaders/loader-2.svg';
import styles from "./styles.module.css";
import { PopupContext } from "src/providers/popup";

export default function CheckLinkPopup({ link }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isSafe, setIsSafe] = useState(false);
    const [isError, setIsError] = useState(false);

    const { closePopup } = useContext(PopupContext);
  
    useEffect(() => {
        // Contact Ringer Server to check link
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/link_safety_check`, {
          method: 'POST',
          body: JSON.stringify({
            url: link
          })
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Link Request Failed. Status code: " + response.status);
          }
        })
        .then((data) => {
            setIsChecking(false);
            if (data.safe) {
                setIsSafe(true);
            } else {
                setIsSafe(false);
            }
        })
        .catch((err) => {
            console.error(err);
            setIsChecking(false);
            setIsError(true);
        })
    }, []);
  
    function handle_link_open() {
        window.electronAPI.openURL(link);
        closePopup(); 
    }

    if (isChecking) {
        return (
            <div className={styles.popup}>
                <img className={styles.shield} src={Shield_1} />
                <p>Hang tight! We are checking this link for malicious activity.</p>
                <img className='loader' src={Loader_1} />
            </div>
        )
    }

    if (isError) {
        return (
            <div className={styles.popup}>
                <img src={Shield_3} className={styles.shield} />
                <h1>Failed To Check Link</h1>
                <p>We were unable to check if the link you tried to open is safe.</p>
                <button onClick={closePopup}>Go Back</button>
                <button
                    onClick={handle_link_open}
                    style={{backgroundColor: "red"}}
                >
                    Take Me Anyway
                </button>
            </div>
        )
    }
  
    if (isSafe) {
        return (
            <div className={styles.popup}>
                <img className={styles.shield} src={Shield_2} />
                <p>Go to <i>{link}</i>?</p>
                <button onClick={closePopup}>Go Back</button>
                <button
                    onClick={handle_link_open} 
                    style={{backgroundColor: "#c88200"}}
                >
                    Take Me There
                </button>
            </div>
        )
    } else {
        return (
            <div className={styles.popup}>
                <img className={styles.shield} src={Blocked_Icon} />
                <h1>Ringer Protected You</h1>
                <p>We detected that the link you tried to open may not be safe and could be malicious.</p>
                <button onClick={closePopup}>Back To Safety</button>
                <button 
                    onClick={handle_link_open}
                    style={{backgroundColor: "red"}}
                >
                    Proceed Anyway
                </button>
            </div>
        )
    }
}