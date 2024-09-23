import { useEffect, useRef } from "react";

export default function MessageDestructSelector({ showSelector, setShowSelector, setMessageDestruct, messageDestruct }) {
    const timeInputRef = useRef();

    useEffect(() => {
        if (showSelector && messageDestruct) {
            timeInputRef.current.value = messageDestruct;
        }
        if (showSelector) {
            timeInputRef.current.focus();
        }
    }, [showSelector])

    function handle_set(event) {
        // Prevent the form from refreshing the page
        event.preventDefault();

        const value = timeInputRef.current.value;

        if (value === "0") {
            setMessageDestruct(null);
        } else {
            setMessageDestruct(value);
        }
        
        setShowSelector(false);
    }

    if (showSelector) {
        return (
            <div className="message-destruct-selector" title="">
                <h1>Message Self-Destruct</h1>
                <p>Select how long after the recipient views this message to delete it.</p>
                <p className="small">(Set value to 0 to disable.)</p>
                <form onSubmit={(event) => handle_set(event)}>
                    <input ref={timeInputRef} placeholder="10" required={true} max={20} min={0} type="number" />
                    <span>Minutes</span>
                    <button type="submit">Set</button>
                </form>
            </div>
        );
    }
}