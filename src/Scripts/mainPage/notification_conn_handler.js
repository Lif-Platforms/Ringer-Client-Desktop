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

    const close_conn = () => {
        console.log("Closing conn...")
        socket.onclose = null;
        socket.close();
        socket = null;
        console.log("Conn closed!");
    }

    // Allow "close_conn" to be run by main page
    connectSocket.close_conn = close_conn;

    connect();
}

export default connectSocket;