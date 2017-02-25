const socket = io.connect('http://haglass.japaneast.cloudapp.azure.com:3000/');

socket.on('news', (data) => {
  console.log(data);
});

socket.on('dis_data', (data) => {
	console.log(data);
})
