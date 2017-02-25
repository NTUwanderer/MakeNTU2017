var WebSocketServer = require('websocket').server;
var http = require('http');

let lastTime = null;
let totalTimeWatchingScreen = 0;
// const one_minute_array = [];

const threshold_dis = 60;

const storeDistance = (data) => {
    delete data.MS;

    if (lastTime != null && data.CM < threshold_dis)
        totalTimeWatchingScreen += data.time - lastTime;

    lastTime = data.time;

	console.log(totalTimeWatchingScreen);

//    if (one_minute_array.length == 60)
//        one_minute_array.splice(0, 1);

//     one_minute_array.push(data);

    // Store in database;
}

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3001, function() {
    console.log((new Date()) + ' Server is listening on port 3001');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

let theConnection = null;

function originIsAllowed(origin) {
	if (theConnection == null)
		return true;
	else
		return false;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    theConnection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    theConnection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            storeDistance(JSON.parse(message.utf8Data));
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            theConnection.sendBytes(message.binaryData);
        }
    });
    theConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + theConnection.remoteAddress + ' disconnected.');
		theConnection = null;
    });
});

