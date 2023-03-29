// Import files
import { GetUsername } from './getUsername'; 
import { GetToken } from './getToken';

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
          reject(new Error("Invalid Token"));
        }
  
        if (message === "USER_NO_EXIST") {
          console.log("Nonexistent User");
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
        if (sentFriendRequestList === true) {

          if (message === "INVALID_TOKEN") {
            console.log("Invalid Token");
            ws.removeEventListener("message", listener);
            requestSent = false;
            sentFriendRequestList = false;
            reject(new Error("Invalid Token"));
          } else {
            ws.removeEventListener("message", listener);
            requestSent = false;
            sentFriendRequestList = false;
            resolve(message);
          }
        }
  
      };
  
      ws.addEventListener("message", listener);
    });    
}

export default { addNewConversation, requestFriendRequestsList };
