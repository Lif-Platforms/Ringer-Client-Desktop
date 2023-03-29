export function logIn(navigate) {
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

        var message = event.data;

        // Checks if the message sent by the server was asking for the login credentials
        if (message === "SEND_CREDENTIALS") {

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
        if (message === "LOGIN_GOOD") {
            // Gets the element "loginStatus"
            const loginStatus = document.getElementById('loginStatus');

            // Changes the status of "loginStatus"
            loginStatus.innerHTML = "Login Successful";
            loginStatus.style.color = "green";

            // Gets the username from the input element to store in a cookie
            var usernameInput2 = document.getElementById("username");
            var username2 = usernameInput2.value;

            console.log("USERNAME: " + username2)

            // Sets the username in a cookie for later access
            document.cookie = "Username=" + username2;

            // Requests a token from the server
            ws.send('TOKEN');
        }

        // Checks if the login was not successful
        if (message === "INVALID_CREDENTIALS") {
            // Gets the element "loginStatus"
            const loginStatus = document.getElementById('loginStatus');

            // Changes the status of "loginStatus"
            loginStatus.innerHTML = "Incorrect username or password";
            loginStatus.style.color = "red";

            return "Login Bad";
        }

        // Checks if the server sent a token
        if (message.startsWith('TOKEN:')) {
            // Extracts the token from the message
            var token = message.slice(6);

            // Sets the token in a cookie for later access
            document.cookie = "Token=" + token;
            
            // Closes the connection
            ws.close();

            // Navigates to main page
            
            console.log("Navigating to main page...");
            navigate("../Pages/main");
            
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