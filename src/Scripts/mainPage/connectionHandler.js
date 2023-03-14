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
export async function addNewConversation(username) {
    // Requests to send a friend request from the server 
    ws.send("SEND_FRIEND_REQUEST");

    // Adds a temporary event listener for communicating with the server
    ws.addEventListener('message', (event) => {
        console.log(event.data)
    });

    return Promise.resolve('Hello World');
}

export default addNewConversation;