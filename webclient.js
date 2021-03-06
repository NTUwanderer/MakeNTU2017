var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

const spawn = require('child_process').spawn;
const command = spawn('python2', ['hahaha.py']);

const connectToServer = () => {
	client.connect('ws://haglass.japaneast.cloudapp.azure.com:3001/', 'echo-protocol');
}

command.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
	let object = null;
	try {
		object = JSON.parse(data);
	} catch (e) {
		console.log(e);
	}
	if (object !== null) {
		let temp_date = new Date();
		object.time = temp_date.getTime();
		if (theConnection != null) {
			theConnection.send(JSON.stringify(object));
		} else {
			connectToServer();
		}
	}
});

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

let theConnection = null;

const closeTheGlasses = () => {
	console.log("closeTheGlasses");
	const command = spawn('sudo', ['python2', 'high_low.py', 'F']);
}

const openTheGlasses = () => {
	console.log("openTheGlasses");
	const command = spawn('sudo', ['python2', 'high_low.py', 'T']);
}

client.on('connect', function(connection) {
	theConnection = connection;
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
        theConnection = null;
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // console.log("Received: '" + message.utf8Data + "'");
			console.log(message);

			if (message.utf8Data === "Close the glasses.")
				closeTheGlasses();
			else if (message.utf8Data === "Open the glasses.")
				openTheGlasses();
		}
    });

});

connectToServer();
