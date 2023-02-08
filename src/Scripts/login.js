const net = require('net');

export function logIn() {
    console.log('Connecting...');
    //creates a new socket connection
    const client = new net.Socket();
    //connects to tcp server
    client.connect({port:20200, host:"127.0.0.1"});
    console.log('Connected to Server!');
    //handles incoming data and replies to the server
    client.on('data', function(data) {
        console.log(data)
    })
}

export default logIn;