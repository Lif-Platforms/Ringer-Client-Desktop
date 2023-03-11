export async function createAccount() {
    // Creates new Websocket Instance 
    const ws = new WebSocket('ws://localhost:8000');

    // Open the connection
    ws.addEventListener('open', (event) => {
        console.log('WebSocket connection opened');
        
        // Requests Account Creation
        ws.send("CREATE_ACCOUNT");
    });

    // Handle errors
    ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Handle connection close
    ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
    });
    // Handles Incoming Messages
    ws.addEventListener('message', (event) => {
        // Checks if the server asked for the credentials 
        if(event.data === "CREDENTIALS?") {
            // Gets the text inside the username input
            var usernameInput = document.getElementById('username');
            var username = usernameInput.value; 

            // Gets the text inside the email input
            var emailInput = document.getElementById('email');
            var email = emailInput.value;

            // Gets the text inside the password input 
            var passwordInput = document.getElementById('password');
            var password = passwordInput.value; 

            // Compiles all the data into json format
            var credentials = {Username : username, Email : email, Password : password};
            var data = JSON.stringify(credentials);

            // Sends data to the server
            ws.send(data);

        }
    })
}

export default createAccount;