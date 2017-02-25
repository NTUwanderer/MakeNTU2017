const socket = io.connect('http://haglass.japaneast.cloudapp.azure.com:3009/');

socket.on('news', (data) => {
  console.log(data);
});

socket.on('disdata', (data) => {
	console.log(data);
})
