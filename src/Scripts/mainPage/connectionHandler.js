const ws = new WebSocket('ws://localhost:8000');

// Open the connection
ws.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
});

// Handle errors
ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

// Handle connection close
ws.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
});

// Function for adding direct messages
export function addNewConversation() {
    ws.send('Hello Server!'); // This is a test. will be removed later
}

export default addNewConversation;