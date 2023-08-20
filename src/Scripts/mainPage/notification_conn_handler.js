import { GetToken } from './getToken';
import { GetUsername } from './getUsername';

// Get client auth info
async function connectSocket(conversation_id, messages, update_messages) {
    let socket = null;
    let reconnectInterval = 1000; // Initial reconnect interval in milliseconds
    const maxReconnectInterval = 30000; // Maximum reconnect interval in milliseconds

    const username = await GetUsername();
    const token = await GetToken();

    const connect = () => {
        console.log("Connecting to service...");
        if (socket !== null) {
            socket.close(); // Close the existing socket if it exists
        }
        socket = new WebSocket("ws://localhost:8001/live_updates");

        socket.onopen = (event) => {
            console.log("WebSocket connection opened:", event);
            document.getElementById("ReconnectBar").classList.remove('reconnectBarShow');
            document.getElementById("ReconnectBar").classList.add('reconnectBarHide');
            socket.send(JSON.stringify({ Username: username, Token: token }));
        };

        socket.onmessage = (event) => {
            console.log("Received:", event.data);
            let server_data = JSON.parse(event.data);

            console.log(conversation_id);
        
            if (server_data.Type === "MESSAGE_UPDATE") {
                if (server_data.Id === conversation_id) {
                    // Create a new array with the new message added
                    const updatedMessages = [...messages, server_data.Message];
                    update_messages(updatedMessages);
                    console.log("Conversation Updated!");
                } else {
                    console.log("Received message! Conversation Not Selected");
                }
            }
        };

        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);

            // Reconnect with an increasing interval
            setTimeout(() => {
                reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
                document.getElementById("ReconnectBar").classList.remove('reconnectBarHide');
                document.getElementById("ReconnectBar").classList.add('reconnectBarShow');
                connect();
            }, reconnectInterval);
        };
    };

    connect();
}

export default connectSocket;
