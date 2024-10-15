import { useEffect, useState } from "react";
import Close_Icon from '../../assets/global/Close_Button.png';
import Loader_1 from '../../assets/global/loaders/loader-1.svg';

export default function ProfilePopUp({ showPopup, popupUsername, setShowPopup }) {
    const [popupState, setPopupState] = useState('loading');
  
    // Fetch profile information
    useEffect(() => {
      console.log("Popup is " + showPopup)
      // Check if popup is open
      if (showPopup) {
        // Set popup state to loading
        if (popupState !== 'loading') {
          setPopupState('loading');
        }
        // Save profile info to be updated in the useState var later
        let profileInfo = {};
  
        // Get user pronouns
        const fetchPronouns = fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_pronouns/${popupUsername}`)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error("Failed to load pronouns!");
            }
          })
          .then(pronouns => {
            profileInfo.pronouns = pronouns.slice(1, -1);
          })
          .catch(err => {
            profileInfo.pronouns = err;
          });
  
        // Get user bio
        const fetchBio = fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_bio/${popupUsername}`)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error("Failed to load bio!");
            }
          })
          .then(bio => {
            profileInfo.bio = bio.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '');
          })
          .catch(err => {
            profileInfo.bio = err;
          });
  
        // Wait for both fetch requests to complete
        Promise.all([fetchPronouns, fetchBio]).then(() => {
          console.log("profile info: " + JSON.stringify(profileInfo));
  
          // Update popup state
          setPopupState(profileInfo);
        });
      }
    }, [showPopup, popupUsername]);
  
    useEffect(() => {
      console.log("popup state: " + popupState)
    }, [popupState])
  
    if (showPopup) {
      return (
        <div className='profile-popup'>
          <button onClick={() => setShowPopup(false)} className='close-button'>
            <img src={Close_Icon} alt='' />
          </button>
          <div className='header'>
            <img draggable="false" src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${popupUsername}.png`} alt='' />
            <h1>{popupUsername}</h1>
          </div>
          {popupState === 'loading' ? (
            <img src={Loader_1} alt='' />
          ) : (
            <div>
              <h2>Pronouns</h2>
              <p>{popupState.pronouns}</p>
              <h2>Bio</h2>
              <p>{popupState.bio}</p>
            </div>
          )}
        </div>
      );
    }
    
  }