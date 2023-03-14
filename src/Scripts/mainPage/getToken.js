export async function GetToken() {
    // split the cookie string into an array of cookies
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        // split each cookie into its name and value
        const [name, value] = cookie.split("="); 
        if (name.trim() === "Token") {
            // decode the cookie value (if it's encoded)
            const decodedValue = decodeURIComponent(value.trim()); 
            // Returns the token
            return Promise.resolve(decodedValue);
        }
    }   
}
export default GetToken;