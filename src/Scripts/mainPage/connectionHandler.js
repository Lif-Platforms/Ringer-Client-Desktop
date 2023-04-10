// Import files
import { GetUsername } from './getUsername'; 
import { GetToken } from './getToken';
let ws = null;

// Function to establish the WebSocket connection
function connect() {
  ws = new WebSocket('ws://localhost:8000');

  // Open the connection
  ws.addEventListener('open', (event) => {
    console.log('WebSocket connection opened');
    const element = document.getElementById("ReconnectBar");
    element.classList.remove("reconnectBarShow");
    element.classList.add("reconnectBarHide");
  });

  // Handle errors
  ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Handle connection close and attempt to reconnect
  ws.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
    const element = document.getElementById("ReconnectBar");
    element.classList.remove("reconnectBarHide");
    element.classList.add("reconnectBarShow");
    console.log('Reconnecting in 1 seconds...');
    setTimeout(() => connect(), 1000);
  });
}

// Call the connect function to establish the initial connection
connect();

var sentFriendRequest = false;

// Function for adding direct messages
export async function addNewConversation(username) {
    if (!sentFriendRequest) {
      // Requests to send a friend request from the server 
      ws.send("SEND_FRIEND_REQUEST");
      sentFriendRequest = true;
    }
  
    return new Promise((resolve, reject) => {
      // Adds a temporary event listener for communicating with the server
      const listener = async (event) => {
        console.log(event.data);
        const message = event.data;
  
        // Checks if the server has requested the user
        if (message === "USER?") {
          // Gets the username of the user sending the request
          const sender = await GetUsername();
  
          // Gets the token of the user sending
          const token = await GetToken();
  
          // Prepares the data to be sent to the server
          const userData = { From: sender, To: username, Token: token };
          const data = JSON.stringify(userData);
  
          // Sends the data to the server
          ws.send(data);
          console.log("sent user to server");
        }
  
        if (message === "INVALID_TOKEN") {
          console.log("Invalid Token");
          ws.removeEventListener("message", listener);
          reject(new Error("Invalid Token"));
        }
  
        if (message === "USER_NO_EXIST") {
          console.log("Nonexistent User");
          ws.removeEventListener("message", listener);
          reject(new Error("Nonexistent User"));
        }
  
        if (message === "REQUEST_SENT!") {
          console.log("Request sent successfully");
          sentFriendRequest = false;
          ws.removeEventListener("message", listener);
          resolve("Request sent successfully");
        }
      };
  
      ws.addEventListener("message", listener);
    });
  }

// Variable for checking if the client requested the requests list
var sentFriendRequestList = false;

var requestSent = false;

// Function for requesting friend requests from the server
export async function requestFriendRequestsList() {
  if (!requestSent) {
    // Requests friend requests 
    ws.send("LIST_FRIEND_REQUESTS");
    requestSent = true;
  }

  return new Promise((resolve, reject) => {
    // Adds a temporary event listener for communicating with the server
    const listener = async (event) => {
      console.log(event.data);
      const message = event.data;

      // Checks if the server has requested the user
      if (message === "VERIFY?") {
        // Gets the username of the user sending the request
        const sender = await GetUsername();

        // Gets the token of the user sending
        const token = await GetToken();

        // Prepares the data to be sent to the server
        const userData = { Username: sender, Token: token };
        const data = JSON.stringify(userData);

        // Sends the data to the server
        ws.send(data);
        console.log("sent user to server");
      }

      // Checks if the request was sent
      if (message === "INVALID_TOKEN") {
        console.log("Invalid Token");
        ws.removeEventListener("message", listener);
        requestSent = false;
        reject(new Error("Invalid Token"));
      } else if (message) {
        try {
          const parsedMessage = JSON.parse(message);
          ws.removeEventListener("message", listener);
          requestSent = false;
          console.log("Got List")
          resolve(parsedMessage);
        } catch (e) {
          console.log("Error parsing message:", e);
        }
      }
    };

    ws.addEventListener("message", listener);
  });    
}

// Function for accepting friend requests
export async function acceptFriendRequest(request) {
  // Tells the server that the client is accepting a friend request 
  ws.send("ACCEPT_FREIND_REQUEST");

  return new Promise((resolve, reject) => { 
    // Adds a temporary event listener for communicating with the server
    const listener = async (event) => {
      console.log(event.data);
      const message = event.data;
      // Checks if the server has requested the user
      if (message === "USER?") {
        // Gets the username of the client
        const username = await GetUsername();

        // Gets the token 
        const token = await GetToken();

        // Prepares the data to be sent to the server
        const data = {Username:username, Request:request, Token:token};
        const sendData = JSON.stringify(data)

        // Sends data to the server
        ws.send(sendData); 
      }
      // Checks if the server has accepted the request
      if (message === "REQUEST_ACCEPTED") {
        ws.removeEventListener("message", listener);
        resolve("ACCEPTED!");
      }
    }
    ws.addEventListener("message", listener);
  });
}

export default { addNewConversation, requestFriendRequestsList, acceptFriendRequest };