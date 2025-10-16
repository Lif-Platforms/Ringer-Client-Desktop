import icon from '../../../assets/home/info_sidebar_button.svg';
import { useState, useEffect, useContext } from 'react';
import { InfoSidebarContext } from 'src/providers/info_sidebar';

export default function InfoSidebarButton({ username }) {
    // Access info sidebar context
    const { open_sidebar, close_sidebar, infoSidebarOpen, shouldReopen } = useContext(InfoSidebarContext);

    // State to track the button's active status
    const [isActive, setIsActive] = useState(false);

    // Keep the current window size
    // This will enable/disable the button based on the window size
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    // Add event listener to track window size changes
    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerWidth);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Enable/disable the button based on the window size
    useEffect(() => {
        if (windowSize >= 1100) {
            setIsActive(true);

            // Check if the sidebar should be reopen automatically
            if (shouldReopen) {
                open_sidebar(username);
            }
        } else {
            setIsActive(false);

            // Close the sidebar if the window is resized to a smaller size
            // but tell it to reopen when the window is resized again
            if (infoSidebarOpen) {
                close_sidebar(true);
            }
        }
    }, [windowSize, shouldReopen]);

    function toggle_sidebar() {
        if (infoSidebarOpen) {
            close_sidebar();
        } else {
            open_sidebar(username);
        }
    }

    return (
        <button disabled={!isActive} onClick={toggle_sidebar}>
            <img src={icon} alt=""/>
        </button>
    )
}