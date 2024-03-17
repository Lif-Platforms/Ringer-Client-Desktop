async function connectSocket(conversationIdRef, messagesRef, update_messages) {
    console.log("Conversation Id: " + conversationIdRef.current);

    let socket = null;
    let reconnectInterval = 1000; // Initial reconnect interval in milliseconds
    const maxReconnectInterval = 30000; // Maximum reconnect interval in milliseconds

    // Get client auth info
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

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
            } else if (server_data.Type === "FRIEND_REQUEST_ACCEPT") {
                // Create accept friend request event
                const friend_request_accept_event = new CustomEvent("Friend_Request_Accept", {
                    detail: {
                        username: server_data.User,
                        id: server_data.Id
                    }
                });

                document.dispatchEvent(friend_request_accept_event);
            }
        };

        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);

            // Reconnect only if the connection was not closed intentionally
            if (event.code !== 1000) {
                console.log("Trying to reconnect...")
                setTimeout(() => {
                    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
                    document.getElementById("ReconnectBar").classList.remove('reconnectBarHide');
                    document.getElementById("ReconnectBar").classList.add('reconnectBarShow');
                    connect();
                }, reconnectInterval);
            }
        };


    };

    const send_message = async (message, conversation_id) => {
        // Check if the socket is open
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ MessageType: "SEND_MESSAGE", ConversationId: conversation_id, Message: message }));
    
            console.log("Message sent to server");
    
            // Create a promise that resolves when the server acknowledges the message
            const messageSentPromise = new Promise((resolve) => {
                const handleMessage = (event) => {
                    const data = event.data;
                    const parsedData = JSON.parse(data);
    
                    if ("ResponseType" in parsedData && parsedData["ResponseType"] === "MESSAGE_SENT") {
                        console.log("Message sent!");
                        resolve("message_sent");
                        // Remove the event listener to avoid further processing
                        socket.removeEventListener("message", handleMessage);
                    }
                };
    
                // Attach the event listener
                socket.addEventListener("message", handleMessage);
            });
    
            // Wait for the acknowledgment or other responses
            try {
                const response = await messageSentPromise;
                return response; // Return the processed value
            } catch (error) {
                console.error("Error while waiting for server response:", error);
                return null; // Handle any errors during communication
            }
        } else {
            console.warn("WebSocket is not open. Cannot send message.");
            return null; // Handle the case when the socket is not open
        }
    };    

    const close_conn = () => {
        console.log("Closing conn...")
        socket.onclose = null;
        socket.close();
        socket = null;
        console.log("Conn closed!");
    }

    // Allow "close_conn" to be run by main page
    connectSocket.close_conn = close_conn;
    connectSocket.send_message = send_message;

    connect();
}

export default connectSocket;