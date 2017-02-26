var WebSocketServer = require('websocket').server;
var http = require('http');

let totalTimeWatchingScreen = 0;
// const one_minute_array = [];

const threshold_dis = 60;

const interval = 10;

let time_array = [];

let time_near = 0;
let time_far = 0;
let total_time = 0;
let open = true;

let time_close = 0;

const reset = () => {
    time_array = [];
    time_near = 0;
    time_far = 0;
    total_time = 0;
    open = true;
}

const closeTheGlasses = (time) => {
    if (theConnection !== null)
        theConnection.send("Close the glasses.");
    
    open = false;
    time_array = [];
    time_near = 0;
    time_far = 0;
    total_time = 0;
    time_close = time;

    theSocket.emit('status', false);
    theSocket.broadcast.emit('status', false);
}

const openTheGlasses = () => {
    if (theConnection !== null)
        theConnection.send("Open the glasses.");

    theSocket.emit('status', true);
    theSocket.broadcast.emit('status', true);
    open = true;
}

const storeDistance = (data) => {
    delete data.MS;

    if (open) {
        let size = time_array.length;
        if (size !== 0) {
            let delta = data.time - time_array[size - 1].time;
            if (data.CM < threshold_dis)
                time_near += delta;
            else
                time_far  += delta;
            total_time += delta;
        }

        time_array.push(data);

        if (size >= interval + 1) {
            let delta = time_array[1].time - time_array[0].time;
            if (time_array[0].CM < threshold_dis)
                time_near -= delta;
            else
                time_far  -= delta;
            total_time -= delta;

            time_array.shift();
        	if (time_near > 0.7 * total_time) {
        	    closeTheGlasses(data.time);
        	}
        }
    } else if (data.time > time_close + interval * 1000) {
        openTheGlasses();
    }

    if (theSocket !== null) {
        theSocket.emit('disdata', data);
        theSocket.broadcast.emit('disdata', data);
    	console.log('emit on disdata');
    }
	
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

var express = require('express');
var path = require('path');
var app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use('/', express.static(path.join(__dirname, 'static')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let theSocket = null;

io.on('connection', (socket) => {
    if (theSocket === null)
        theSocket = socket;

	// console.log('theSocket Init:', theSocket);    
    socket.emit('news', { hello: 'world' });

    // socket.on('getmessage', data => {
    //  socket.emit('', `You entered ${data.roomname}.`);
    // });

    socket.on('disconnect', () => {
        theSocket = null;
        reset();
        console.log('disconnected...');
    });

});

httpServer.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
