import { createContext, useState } from "react";

// Create a context for the info sidebar
export const InfoSidebarContext = createContext();

// Create a provider component
export const InfoSidebarProvider = ({ children }) => {
    // Store initial state for sidebar
    let initialSidebarState = false;

    // Get local storage value for the sidebar state
    const storedSidebarState = localStorage.getItem('infoSidebarOpen');

    // Check if the sidebar state is set in local storage
    if (storedSidebarState) {
        // Parse the stored value to a boolean
        const parsedSidebarState = JSON.parse(storedSidebarState);
        initialSidebarState = parsedSidebarState;
    } else {
        // Set the local storage value to the default state
        localStorage.setItem('infoSidebarOpen', initialSidebarState);
    }

    // Store initial grid template columns
    let initialGridTemplateColumns = '50px 230px auto';

    // Update grid columns based on initial sidebar state
    if (initialSidebarState) {
        initialGridTemplateColumns = '50px 230px auto max-content';
    }

    // Hold the state for the sidebar
    const [infoSidebarOpen, setInfoSidebarOpen] = useState(initialSidebarState);
    const [infoSidebarUsername, setInfoSidebarUsername] = useState(null);

    // Hold the state for the grid template columns based on the info sidebar state
    const [gridTemplateColumns, setGridTemplateColumns] = useState(initialGridTemplateColumns);

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
    function close_sidebar() {
        // Close sidebar and update app layout
        setInfoSidebarOpen(false);
        setGridTemplateColumns('50px 230px auto');

        // Update localstorage with state preference
        localStorage.setItem('infoSidebarOpen', false);
    }

    return (
        <InfoSidebarContext.Provider value={{
            infoSidebarOpen,
            infoSidebarUsername,
            setInfoSidebarUsername,
            open_sidebar,
            close_sidebar,
            gridTemplateColumns,
        }}>
            {children}
        </InfoSidebarContext.Provider>
    );
};