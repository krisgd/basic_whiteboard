/**
 * @author Kris Doromal
 */

//required modules
var io = require("socket.io"),
	connect("connect");
	
//use connect to start a server   use function is used to connect to the public folder
var app = connect().use(connect.static("public"))listen(3000, "0.0.0.0");

//create websocket listen to the app made with connect
var server = io.listen(app);

//client connects
server.sockets.on("connection", function(socket){
	
	//broadcast to users when dot is drawn
	socket.on("drawDot", function(data){
		socket.broadcast.emit("drawDot", data);
	})
	
	//braodcast to users when line is drawn
	socket.on("drawLine", function(data){
		socket.broadcast.emit("drawLine", data);
	})
	
	//broadcast to users when clear is called
	socket.on("clearDrawing", function(){
		socket.broadcast.emit("clearDrawing");
	})
});
