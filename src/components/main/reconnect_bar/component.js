import styles from "./styles.module.css";
import Loader from '../../../assets/global/loaders/loader-2.svg';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from "react";

export default function ReconnectBar() {
    const [showBar, setShowBar] = useState(false);

    useEffect(() => {
        function handleWsEvent(event) {
            console.debug(event);
            setShowBar(!event.detail.connected);
        }
        document.addEventListener("wsEvent", handleWsEvent);

        return () => {
            document.removeEventListener("wsEvent", handleWsEvent);
        }
    }, []);

    return (
        <AnimatePresence>
            {showBar ? (
                <motion.div
                    className={styles.container}
                    initial={{ translateY: -200 }}
                    animate={{ translateY: 0 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    exit={{ translateY: -200 }}
                >
                    <div className={styles.bar}>
                        <span>Reconnecting</span>
                        <img src={Loader} alt="Loader" />
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}