import { createContext, useEffect, useState } from "react";

// Create a context for the info sidebar
export const InfoSidebarContext = createContext();

// Create a provider component
export const InfoSidebarProvider = ({ children }) => {
    // Hold wether the sidebar should reopen on its own
    const [shouldReopen, setShouldReopen] = useState(false);

    // Hold the state for the sidebar
    const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
    const [infoSidebarUsername, setInfoSidebarUsername] = useState(null);

    // Hold the state for the grid template columns based on the info sidebar state
    const [gridTemplateColumns, setGridTemplateColumns] = useState('50px 230px auto');

    // Determine if the sidebar should open on launch
    useEffect(() => {
        // Get local storage value for the sidebar state
        const storedSidebarState = localStorage.getItem('infoSidebarOpen');
        const parsedStoredState = JSON.parse(storedSidebarState); 

        // Check if the sidebar should open
        if (window.innerWidth >= 1100 && parsedStoredState) {
            setInfoSidebarOpen(true);
            setGridTemplateColumns('50px 230px auto max-content');
        } else if (window.innerWidth < 1100 && parsedStoredState) {
            // If the sidebar should open but cant, keep it closed but
            // make it reopen when the window is resized
            setShouldReopen(true);
        }
    }, []);

    function open_sidebar(username) {
        // Set the grid template columns to make room for the sidebar
        setGridTemplateColumns('50px 230px auto max-content');

        // Open the sidebar
        // Add a 0.01ms delay to allow the CSS layout to take effect
        setTimeout(() => {
            setInfoSidebarOpen(true);
            setInfoSidebarUsername(username);
        }, 0.01);

        // Update localstorage with state preference
        localStorage.setItem('infoSidebarOpen', true);
    }

    // Function to close the sidebar
    function close_sidebar(shouldReopen = false) {
        // Close sidebar and update app layout
        setInfoSidebarOpen(false);
        setGridTemplateColumns('50px 230px auto');

        console.debug("Should Reopen:", shouldReopen);

        // Set the sidebar to reopen when the window is resized
        if (shouldReopen) {
            setShouldReopen(true);
        } else {
             // Update localstorage with state preference
             // We only update this when the sidebar was manually closed by the user
            localStorage.setItem('infoSidebarOpen', false);

            // Ensure the sidebar does not automatically reopen
            setShouldReopen(false);
        }
    }

    return (
        <InfoSidebarContext.Provider value={{
            infoSidebarOpen,
            infoSidebarUsername,
            setInfoSidebarUsername,
            open_sidebar,
            close_sidebar,
            gridTemplateColumns,
            shouldReopen,
        }}>
            {children}
        </InfoSidebarContext.Provider>
    );
};