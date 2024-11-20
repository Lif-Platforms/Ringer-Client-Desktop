import React, { useEffect, useRef, useState } from 'react';
import "../../css/main.css";

export default function SendLoader({ isSending }) {
    const [progress, setProgress] = useState(0);
    const sendTimeout = useRef();
    const [loaderTransition, setLoaderTransition] = useState(0);
    const loadingInterval = useRef();

    useEffect(() => {
        function handle_progress() {
            loadingInterval.current = setInterval(() => {
                setProgress((prevProgress) => (prevProgress < 90 ? prevProgress + 1 : prevProgress));
            }, 20);
        }

        if (isSending) {
            // Give message 1 second to send before showing loader
            sendTimeout.current = setTimeout(() => handle_progress(), 1000);
        } else {
            clearTimeout(sendTimeout.current);
            clearInterval(loadingInterval.current);

            // Complete loader if it has started
            if (progress > 0) {
                setLoaderTransition(0.2);
                setProgress(100);

                setTimeout(() => {
                    setLoaderTransition(0);
                    setProgress(0);
                }, 200);
            } else {
                setProgress(0);
            } 
        }

        return () => {
            clearInterval(loadingInterval.current);
            clearInterval(sendTimeout.current);
        };
    }, [isSending]);

    return (
        <div style={{ width: `${progress}%`, transition: `${loaderTransition}s`}} className='sendLoader' />
    );
}
