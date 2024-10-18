import { useEffect, useRef, useState } from "react";
import loader from '../../assets/global/loaders/loader-1.svg';
import FriendSearchResult from "./friend_search_result";

export default function AddNewConversationMenu({ showPopup, setShowPopup }) {
    const [panelState, setPanelState] = useState('loading');
    const [ws, setWs] = useState(null);
    const [searchResults, setSearchResults] = useState("");
    const searchInput = useRef();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
      if (showPopup) {
        const websocket = new WebSocket(`${process.env.REACT_APP_RINGER_WS_URL}/user_search`);
        setWs(websocket);

        websocket.onopen = () => {
            console.log('Connected to WebSocket');
            setPanelState('ready');
        };

        websocket.onmessage = async (event) => {
            // Parse data and update results
            const parsed_data = JSON.parse(event.data);
            setSearchResults(parsed_data);
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            websocket.close();
        };
      } else {
        if (ws) {
          ws.close();
          setSearchResults("");
          setDisabled(false);
        }
      }
    }, [showPopup]);

    const sendData = () => {
      if (ws && ws.readyState === WebSocket.OPEN && searchInput.current) {
          ws.send(JSON.stringify({user: searchInput.current.value}));
      } else {
          console.log('WebSocket connection is not open');
      }
    };
    
    if (showPopup) {
      return (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            {panelState === 'loading' ? (
              <>
                <h3>One Moment</h3>
                <img src={loader} />
              </>
            ) : (
              <>
                <h3>Find Your Friends</h3>
                <input disabled={disabled} onKeyUp={sendData} ref={searchInput} placeholder='Search Username' type="search" />
                <div className="search_results">
                  {Array.isArray(searchResults) && searchResults.length > 0 ? (
                    searchResults.map((username) => (
                      <FriendSearchResult 
                        disabled={disabled}
                        username={username}
                        setDisabled={setDisabled}
                      />
                    ))
                  ) : Array.isArray(searchResults) && searchResults.length === 0 ? (
                    <h1>No Results</h1>
                  ) : (
                    <h1>Start By Typing</h1>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }