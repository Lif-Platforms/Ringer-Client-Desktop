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

            if (server_data.Type === "MESSAGE_UPDATE") {
                if (server_data.Id === conversationIdRef.current) {
                    console.log("Type of messagesRef.current:", typeof messagesRef.current);
                    // Update the ref values directly
                    messagesRef.current = [...messagesRef.current, server_data.Message];

                    // Call update_messages with the updated array
                    update_messages(messagesRef.current);
                    
                    // If the conversation that the message was sent in is selected,
                    // Tell the server that the message has been viewed
                    if (conversationIdRef.current === server_data.Id && username !== server_data.Message.Author) {
                        socket.send(JSON.stringify({MessageType: "VIEW_MESSAGE", Message_Id: server_data.Message.Id, Conversation_Id: server_data.Id}));
                    }

                    // Admit an event to update the friends list
                    const message_update_event= new CustomEvent("Message_Update", {
                        detail: {
                            conversation_id: server_data.Id,
                            message: `${server_data.Message.Author} - ${server_data.Message.Message}`
                        }
                    });
                    document.dispatchEvent(message_update_event);
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

            } else if (server_data.Type === "REMOVE_CONVERSATION") {
                // Create accept friend request event
                const conversation_removal_event = new CustomEvent("Conversation_Removal", {
                    detail: {
                        id: server_data.Id
                    }
                });

                document.dispatchEvent(conversation_removal_event);

            } else if (server_data.Type === "USER_STATUS_UPDATE") {
                // Create accept status update event
                const user_status_update_event = new CustomEvent("User_Status_Update", {
                    detail: {
                        user: server_data.User,
                        status: server_data.Online
                    }
                });

                document.dispatchEvent(user_status_update_event);

            } else if (server_data.Type === "USER_TYPING") {
                const user_typing_update_event = new CustomEvent("User_Typing_Update", {
                    detail: {
                        user: server_data.User,
                        id: server_data.Id,
                        typing: server_data.Typing
                    }
                });

                document.dispatchEvent(user_typing_update_event);
            } else if (server_data.Type === "DELETE_MESSAGE") {
                const delete_message_event = new CustomEvent("Delete_Message", {
                    detail: {
                        conversation_id: server_data.Conversation_Id,
                        message_id: server_data.Message_Id
                    }
                });

                document.dispatchEvent(delete_message_event);
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

    const send_message = async (message, conversation_id, self_destruct, message_type) => {
        // Check if the socket is open
        if (socket.readyState === WebSocket.OPEN) {
            // Get current UTC time
            const UTC_time = new Date().toISOString();

            let data = {
                MessageType: "SEND_MESSAGE",
                ConversationId: conversation_id,
                Message: message,
                SendTime: UTC_time
            }

            // Check if user is sending a GIF message
            if (message_type && message_type.type === "GIF") {
                data['Message_Type'] = "GIF";
                data['GIF_URL'] = message_type.url;
            }

            // Check if message will self-destruct
            if (self_destruct) {
                data['Self-Destruct'] = self_destruct;
            }

            console.log("sent message: " + JSON.stringify(data));

            socket.send(JSON.stringify(data));
    
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

    const update_typing_status = (conversation_id, status) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({MessageType: "USER_TYPING", ConversationId: conversation_id, Typing: status}));
        }
    }

    // Allow "close_conn" to be run by main page
    connectSocket.close_conn = close_conn;
    connectSocket.send_message = send_message;
    connectSocket.update_typing_status = update_typing_status;

    connect();
}

export default connectSocket;