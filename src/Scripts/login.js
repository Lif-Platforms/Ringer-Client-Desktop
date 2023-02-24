export function logIn() {
    // Create a WebSocket instance
    const ws = new WebSocket('ws://localhost:8000');

    // Open the connection
    ws.addEventListener('open', (event) => {
        console.log('WebSocket connection opened');
    
        // Requests a login from the server
        ws.send('USER_LOGIN');
    });

    // Handle messages received from the server
    ws.addEventListener('message', (event) => {
        console.log('Message received from server:', event.data);

        // Checks if the message sent by the server was asking for the login credentials
        if (event.data === "SEND_CREDENTIALS") {

            // Gets the username from the input element
            var usernameInput = document.getElementById("username");
            var username = usernameInput.value;

            // Gets the password form the password element
            var passwordInput = document.getElementById("password");
            var password = passwordInput.value;
            
            // Prepares the login data for sending
            const loginCredentials = {Username : username, Password : password};

            // Converts the login credentials to a string before sending
            const data = JSON.stringify(loginCredentials);
            
            // Sends login credentials
            ws.send(data);
        }

        // Checks if the login was successful
        if (event.data === "LOGIN_GOOD") {
            // Gets the element "loginStatus"
            const loginStatus = document.getElementById('loginStatus');

            // Changes the status of "loginStatus"
            loginStatus.innerHTML = "Login Successful";
            
            //Add Redirect Here
        }

        // Checks if the login was not successful
        if (event.data === "INVALID_CREDENTIALS") {
            // Gets the element "loginStatus"
            const loginStatus = document.getElementById('loginStatus');

            // Changes the status of "loginStatus"
            loginStatus.innerHTML = "Login Unsuccessful";
        }
    });

    // Handle errors
    ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
    });

    // Handle the connection closing
    ws.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
    });
}

export default logIn;