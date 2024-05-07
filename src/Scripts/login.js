export function logIn(navigate, formRef, errorRef, loginButtonRef) {
    // Gets the username and password from the page
    const formData = new FormData(formRef);

    // Update login button
    loginButtonRef.innerHTML = "Logging In..."

    fetch(`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/auth/login`, {
        method: "POST",
        body: formData
    })
    .then(response => {
    if (response.ok) {
        return response.json(); // Convert response to JSON

    } else if (response.status === 401) {
        throw new Error("Incorrect Username or Password");

    } else if (response.status === 403) {
        throw new Error("Account Suspended");

    } else {
        throw new Error("Something Went Wrong");
    }
    })
    .then(data => {
        // Set username and token in local storage
        localStorage.setItem("username", formData.get("username"));
        localStorage.setItem("token", data.token);

        // Navigate to main page
        navigate('/pages/main');

    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        errorRef.innerHTML = error.message;

        // Update login button
        loginButtonRef.innerHTML = "Login"
    });
}

export default logIn;