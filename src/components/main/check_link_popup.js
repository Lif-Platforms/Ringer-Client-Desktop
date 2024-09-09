import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Shield_1 from '../../assets/home/Shield_1.png';
import Shield_2 from '../../assets/home/Shield_2.png';
import Blocked_Icon from '../../assets/home/Blocked_Icon.png';
import Shield_3 from '../../assets/home/Shield_3.png';
import Loader_1 from '../../assets/global/loaders/loader-1.svg';

export default function CheckLinkPopup({ checkLinkPopup, setCheckLinkPopup }) {
    const [linkStatus, setLinkStatus] = useState('checking');
  
    const { conversation_id } = useParams();
  
    useEffect(() => {
      if (checkLinkPopup !== false) {
        // Reset link check state
        setLinkStatus('checking');
  
        // Contact Ringer Server to check link
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/link_safety_check`, {
          method: 'POST',
          body: JSON.stringify({
            url: checkLinkPopup
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
          if (data.safe) {
            setLinkStatus('safe');
          } else {
            setLinkStatus('unsafe');
          }
        })
        .catch((err) => {
          console.error(err);
          setLinkStatus('error');
        })
      }
    }, [checkLinkPopup]);
  
    useEffect(() => {
      setCheckLinkPopup(false);
    }, [conversation_id]);
  
    function handle_link_open() {
      window.electronAPI.openURL(checkLinkPopup);
      setCheckLinkPopup(false);
    }
  
    if (checkLinkPopup) {
      if (linkStatus === 'checking') {
        return (
          <div className='check-link-popup'>
            <img className='shield' src={Shield_1} />
            <p>Hang tight! We are checking this link for malicious activity.</p>
            <img className='loader' src={Loader_1} />
          </div>
        )
      } else if (linkStatus === 'safe') {
        return (
          <div className='check-link-popup'>
            <img className='shield' src={Shield_2} />
            <p>Go to <i>{checkLinkPopup}</i>?</p>
            <button onClick={() => setCheckLinkPopup(false)}>Go Back</button>
            <button onClick={handle_link_open} className='go-button'>Take Me There</button>
          </div>
        )
      } else if (linkStatus === 'unsafe') {
        return (
          <div className='check-link-popup'>
            <img className='shield' src={Blocked_Icon} />
            <h1>Ringer Protected You</h1>
            <p>We detected that the link you tried to open may not be safe and could contain malware.</p>
            <button onClick={() => setCheckLinkPopup(false)}>Back To Safety</button>
            <button onClick={handle_link_open} className='proceed-button'>Proceed Anyway</button>
          </div>
        )
      } else if (linkStatus === 'error') {
        return (
          <div className='check-link-popup'>
            <img src={Shield_3} className='shield' />
            <h1>Failed To Check Link</h1>
            <p>We were unable to check if the link you tried to open is safe.</p>
            <button onClick={() => setCheckLinkPopup(false)}>Go Back</button>
            <button onClick={handle_link_open} className='go-button'>Take Me Anyway</button>
          </div>
        )
      }
    }
  }