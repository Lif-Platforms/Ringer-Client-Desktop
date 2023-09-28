import { GetToken } from './getToken';
import { GetUsername } from './getUsername';

async function connectSocket(conversationIdRef, messagesRef, update_messages) {
    console.log("Conversation Id: " + conversationIdRef.current);

    let socket = null;
    let reconnectInterval = 1000; // Initial reconnect interval in milliseconds
    const maxReconnectInterval = 30000; // Maximum reconnect interval in milliseconds

    // Get client auth info
    const username = await GetUsername();
    const token = await GetToken();

    const connect = () => {
        console.log("Connecting to service...");
        if (socket !== null) {
            socket.close(); // Close the existing socket if it exists
        }
        socket = new WebSocket(`${process.env.REACT_APP_RINGER_WS_URL}/live_updates`);

        socket.onopen = (event) => {
            console.log("WebSocket connection opened:", event);
            document.getElementById("ReconnectBar").classList.remove('reconnectBarShow');
            document.getElementById("ReconnectBar").classList.add('reconnectBarHide');
            socket.send(JSON.stringify({ Username: username, Token: token }));
        };

        socket.onmessage = async (event) => {
            console.log("Received:", event.data);
            let server_data = JSON.parse(event.data);

            console.log(conversationIdRef.current);
        
            if (server_data.Type === "MESSAGE_UPDATE") {
                if (server_data.Id === conversationIdRef.current) {
                  console.log("Type of messagesRef.current:", typeof messagesRef.current);
                  // Update the ref values directly
                  messagesRef.current = [...messagesRef.current, server_data.Message];
                  // You don't need to update conversationIdRef.current if it's not changing
              
                  // Call update_messages with the updated array
                  update_messages(messagesRef.current);
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
