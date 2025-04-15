import styles from './styles.module.css';
import { useContext } from 'react';
import { PopupContext } from '../../../providers/popup';
import close_icon from '../../../assets/home/x_icon.svg';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupRenderer() {
    // Access popup context
    const { popupOpen, closePopup, title, titleAlignment, body } = useContext(PopupContext);

    return (
        <AnimatePresence>
            {popupOpen ? (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.popup}>
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