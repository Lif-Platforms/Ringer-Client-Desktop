import { useEffect, useState } from "react"

export default function ReturnToRecent({ messages_container }) {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        function handle_button_toggle() {
            const scrollBottom = messages_container.current.scrollHeight - messages_container.current.scrollTop - messages_container.current.clientHeight;

            if (scrollBottom >= 4000) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        }

        if (messages_container.current) {
            messages_container.current.addEventListener("scroll", handle_button_toggle);
        }
        
        return () => {
            if (messages_container.current) {
                console.log("added messages scroll event listerner")
                messages_container.current.removeEventListener("scroll", handle_button_toggle);    
            }
        }
    }, [messages_container.current]);

    function reset_scroll() {
        messages_container.current.scrollTop = messages_container.current.scrollHeight;
    }

    if (showButton) {
        return (
            <button onClick={reset_scroll} className="return-to-recent-button">Jump To Recent</button>
        );
    }
}