import styles from './styles.module.css';
import FriendSearchResult from '../friend_search_result/component';
import { useEffect, useState, useRef } from 'react';

export default function AddUserSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [errorText, setErrorText] = useState("");
    const [ws, setWs] = useState(null);
    const searchInput = useRef();

    useEffect(() => {
        const websocket = new WebSocket(`${process.env.REACT_APP_RINGER_WS_URL}/user_search`);
        setWs(websocket);

        websocket.onopen = () => {
            setIsLoading(false);
            setTimeout(() => {
                searchInput.current.focus();
            }, 1);
        };

        websocket.onmessage = async (event) => {
            // Parse data and update results
            const parsed_data = JSON.parse(event.data);
            setSearchResults(parsed_data);
        };

        return () => {
            websocket.close();
        };
    }, []);

    function handle_search(query) {
        if (query.length > 0 && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ user: query }));
        } else {
            setSearchResults([]);
        }
    }

    return (
        <div className={styles.addUserSearch}>
            <input 
                disabled={isLoading}
                placeholder='Search...'
                ref={searchInput}
                className={styles.search}
                onChange={(e) => handle_search(e.target.value)}
                type='search'
            />
            <div className={styles.searchResults}>
                {searchResults.length > 0 ? (
                    searchResults.map((user, index) => (
                        <FriendSearchResult 
                            key={index}
                            username={user}
                            setErrorText={setErrorText}
                        />
                    ))
                ) : (
                    <p className={styles.noResults}>No results found</p>
                )}
            </div>
        </div>
    )
}