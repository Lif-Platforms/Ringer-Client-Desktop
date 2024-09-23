import { useEffect, useRef, useState } from "react";
import connectSocket from "src/Scripts/mainPage/notification_conn_handler";
import { useParams } from "react-router-dom";
import loader from '../../assets/global/loaders/loader-1.svg';

export default function GifSelector({ showGifSelector, setShowGifSelector }) {
    const searchInput = useRef();
    const [gifData, setGifData] = useState();
    
    // Disables search input and button while loading
    const [disabled, setDisabled] = useState(false);

    async function handle_search(e) {
        // Prevent the form from refreshing the app
        e.preventDefault();

        setGifData("loading");
        setDisabled(true);

        // Make request to server for GIFs
        const response = await fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/search_gifs?search=${searchInput.current.value}`);

        if (response.ok) {
            const data = await response.json();
            setGifData(data.data);
            setDisabled(false)
        }
    }

    // Reset GIF data once popup is closed
    useEffect(() => {
        if (showGifSelector === false) {
            setGifData(null);
        }
    }, [showGifSelector]);

    // Get conversation id from url
    const { conversation_id } = useParams();

    function handle_send(url, title) {
        connectSocket.send_message(title, conversation_id, false, {type: "GIF", url: url});
        setShowGifSelector(false);
    }

    if (showGifSelector) {
        return (
            <div className="gif-selector">
                <form className="header" onSubmit={(event) => handle_search(event)}>
                    <input disabled={disabled} ref={searchInput} required={true} type="search" placeholder="Search GIPHY" />
                    <button disabled={disabled} type="submit">Search</button>
                </form>
                {Array.isArray(gifData) && gifData.length > 0 ? (
                    <div className="container">
                        {gifData.map((gif) => (
                            <img onClick={() => handle_send(gif.images.downsized_large.url, gif.title)} key={gif.id} src={gif.images.downsized_large.url} alt={gif.title} />
                        ))}
                    </div>
                ): Array.isArray(gifData) && gifData.length === 0 ? (
                    <div className="container">
                        <h1>No Results</h1>
                    </div>
                ): gifData === "loading" ? (
                    <img src={loader} />
                ): null}
            </div>
        );
    }
}