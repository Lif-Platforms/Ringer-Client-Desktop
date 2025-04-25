import styles from './styles.module.css';
import { useContext, useEffect, useRef } from 'react';
import { PopupContext } from '../../../providers/popup';
import close_icon from '../../../assets/home/x_icon.svg';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupRenderer() {
    // Access popup context
    const { popupOpen, closePopup, title, titleAlignment, body } = useContext(PopupContext);

    const popupWindow = useRef();

    // Add outside click event listener when the popup opens
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Get where the user clicked
            const { clientX, clientY } = event;

            // Get the position of the popup window
            const { left, top, width, height } = popupWindow.current.getBoundingClientRect();

            // Check if the click was outside the popup window
            const isOutside = (
                clientX < left ||
                clientX > left + width ||
                clientY < top ||
                clientY > top + height
            );

            // If the click was outside, close the popup
            if (isOutside) {
                closePopup();
            }
        };

        if (popupOpen) {
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 2);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupOpen, closePopup]);

    return (
        <AnimatePresence>
            {popupOpen ? (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5, type: 'spring'}}
                >
                    <div className={styles.popup} ref={popupWindow}>
                        <div className={styles.header}>
                            <h2 style={{ textAlign: titleAlignment }}>{title}</h2>
                            <button onClick={closePopup}>
                                <img src={close_icon} alt="Close" />
                            </button>
                        </div>
                        <div className={styles.body}>
                            {body}
                        </div>
                    </div>
                </motion.div>
            ): null} 
        </AnimatePresence>
    );
}