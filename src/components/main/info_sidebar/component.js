import { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { InfoSidebarContext } from 'src/providers/info_sidebar';

// Utility function to decode ASCII characters and format \n and \r
function decodeASCII(input) {
    try {
        // Decode percent-encoded characters
        let decoded = decodeURIComponent(input);

        // Replace \n and \r with actual newlines
        decoded = decoded.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

        return decoded;
    } catch (error) {
        console.error('Error decoding ASCII:', error);
        return input; // Return the original input if decoding fails
    }
}

export default function InfoSideBar() {
    // Access info sidebar context
    const { infoSidebarOpen, infoSidebarUsername } = useContext(InfoSidebarContext);

    // Hold user profile info
    const [userPronouns, setUserPronouns] = useState('...');
    const [userBio, setUserBio] = useState('...');

    // Update user profile when username changes
    useEffect(() => {
        // Check if username is null
        if (infoSidebarUsername === null) {
            return;
        }

        // Reset profile info
        setUserPronouns('...');
        setUserBio('...');

        // Fetch pronouns
        fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_pronouns/${infoSidebarUsername}`)
            .then(response => response.text())
            .then(data => {
                // Check if user set pronouns
                if (data === 'null') {
                    setUserPronouns('No pronouns set');
                } else {
                    // Remove quotes and decode ASCII characters
                    const formattedData = decodeASCII(data.replace(/^"|"$/g, ''));
                    setUserPronouns(formattedData);
                }
            })
            .catch(error => {
                console.error('Error fetching pronouns:', error);
            });
        
        // Fetch bio
        fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_bio/${infoSidebarUsername}`)
            .then(response => response.text())
            .then(data => {
                // Check if user set a bio
                if (data === 'null') {
                    setUserBio('No bio set');
                } else {
                    // Remove quotes and decode ASCII characters
                    const formattedData = decodeASCII(data.replace(/^"|"$/g, ''));
                    setUserBio(formattedData);
                }
            })
            .catch(error => {
                console.error('Error fetching bio:', error);
            });
    }, [infoSidebarUsername]);

    // Return nothing if the sidebar is closed
    if (!infoSidebarOpen) {
        return null;
    }

    // Check if username is null
    if (!infoSidebarUsername) {
        return (
            <div className={styles.sidebar}>
                <p className={styles.username_null_text}>Select a conversation to see user info.</p>
            </div>
        )
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.banner_container}>
                <img className={styles.banner} src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_banner/${infoSidebarUsername}.png`} alt="Banner" draggable="false" />
                <div className={styles.banner_fade} />
            </div>
            <div className={styles.avatar_container}>
                <img className={styles.avatar} src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${infoSidebarUsername}.png`} alt="Avatar" draggable="false" />
            </div>
            <h1 className={styles.username} title={infoSidebarUsername}>{infoSidebarUsername}</h1>
            <div className={styles.info}>
                <h2>Pronouns</h2>
                <p style={userPronouns === "No pronouns set" ? {opacity: 0.5} : null}>{userPronouns}</p>
                <h2>Bio</h2>
                <p style={userBio === "No bio set" ? {opacity: 0.5} : null}>{userBio}</p>
            </div>
        </div>
    )
}