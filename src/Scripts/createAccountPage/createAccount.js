export function createAccount() {
    // Get account info
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // Make server request
    return fetch(`http://localhost:8002/create_account/${username}/${email}/${password}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Convert response to JSON
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .then(data => {
        // Work with the data
        console.log(data);
        if (data.status === "unsuccessful") {
            return {"status": "FAIL!", "reason": data.reason}
        } else {
            return {"status": "COMPLETE!"}
        }
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
        return {"status": "FAIL!", "reason": "Something Went Wrong!"}
      });
}

export default createAccount;