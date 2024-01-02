import Cookies from "js-cookie";

export function logIn(navigate) {
    // Gets the username and password from the page
    const username = document.getElementById('username').value;
    const password  = document.getElementById('password').value; 

    fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/login/${username}/${password}`)
    .then(response => {
    if (response.ok) {
        return response.json(); // Convert response to JSON
    } else {
        throw new Error('Request failed with status code: ' + response.status);
    }
    })
    .then(data => {
    // Work with the data

    if (data.Status === "Successful") {
        // Set username and token in local storage
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.Token);

        // Navigate to main page
        navigate('/pages/main');
    } else {
        document.getElementById('loginStatus').innerHTML = "Username or Password is Incorrect!";
    }
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        document.getElementById('loginStatus').innerHTML = "Something Went Wrong!";
    });
}

export default logIn;