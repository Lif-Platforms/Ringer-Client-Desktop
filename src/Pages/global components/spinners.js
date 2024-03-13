import React from 'react';

const ThreeDotSpinner = () => {
    const spinnerStyles = {
        spinnerS1WN: {
            animation: 'spinnerMGfb .8s linear infinite',
            animationDelay: '-.8s',
        },
        spinnerKm9P: {
            animationDelay: '-.65s',
        },
        spinnerJApP: {
            animationDelay: '-.5s',
        },
        '@keyframes spinnerMGfb': {
            '93.75%, 100%': {
                opacity: 0.2,
            },
        },
    };

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle style={spinnerStyles.spinnerS1WN} cx="4" cy="12" r="3" />
            <circle style={spinnerStyles.spinnerKm9P} cx="12" cy="12" r="3" />
            <circle style={spinnerStyles.spinnerJApP} cx="20" cy="12" r="3" />
        </svg>
    );
};

export default ThreeDotSpinner;
