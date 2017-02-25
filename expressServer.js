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
	if (theSocket !== null)
		theSocket = socket;
	
	socket.emit('news', { hello: 'world' });

	// socket.on('getmessage', data => {
	// 	socket.emit('', `You entered ${data.roomname}.`);
	// });

	socket.on('disconnect', () => {
		console.log('disconnected...');
	});

})

httpServer.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
