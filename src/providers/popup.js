import { createContext, useState } from "react";

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    // Hold popup state
    const [popupOpen, setPopupOpen] = useState(false);

    // Hold popup information
    const [title, setTitle] = useState(null);
    const [titleAlignment, setTitleAlignment] = useState('left');
    const [body, setBody] = useState(null);

    // Function to open the popup
    function showPopup(title, titleAlignment, body) {
        setTitle(title);
        setTitleAlignment(titleAlignment);
        setBody(body);
        setPopupOpen(true);
    };

    // Function to close the popup
    function closePopup() {
        setPopupOpen(false);
        setTitle(null);
        setBody(null);
    };

    return (
        <PopupContext.Provider value={{
            popupOpen,
            showPopup,
            closePopup,
            title,
            titleAlignment,
            body
        }}>
            {children}
        </PopupContext.Provider>
    )
}

