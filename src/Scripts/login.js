const net = require('net');

function logIn() {
    //creates a new socket connection
    const client = new net.Socket();
    //connects to tcp server
    client.connect(20200,"127.0.0.1");
    //handles incoming data and replies to the server
    client.on('data', function(data) {
        console.log(data)
    })
}

export default logIn;