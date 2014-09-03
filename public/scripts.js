/**
 * @author Kris Doromal
 */

//SOCKET
var socket;

//EASELJS
var stage;

//DRAWING
var drawingCanvas,
	oldPt,
	oldMidPt,
	color = "#0000FF",
	stroke = 4;

//init
$(function(){
	//socketIO init
	socket = io.connect("http://localhost:3000");
	
	//recieved from server
	socket.on("drawDot", function(data){
		drawDot(data);
	});
	
	socket.on("drawLine",function(data){
		drawLine(data.mpx, data.mpy, data.opx, data.opy, data.ompx, data.ompy);
	});
	
	socket.on("clearDrawing", function(){
		clearDrawing();
	});
		
	
	//easeljs init
	stage = new createjs.Stage(document.getElementById("whiteboard"));
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = false;
	createjs.Touch.enable(stage);
	stage.autoClear = false;
	
	//drawing init
	drawingCanvas = new createjs.Shape();
	stage.addChild(drawingCanvas);
	stage.addEventListener("stagemousedown", mouseDownHandler);
	stage.addEventListener("stagemouseup", mouseUpHandler);
	
	//clear button
	$("#clear_button").click(function(){
		//clear locally
		clearDrawing();
		//clear server broadcast to user
		socket.emit("clearDrawing");
	});
});

function mouseDownHandler(e){
	oldPt = new createjs.Point(e.localX, e.localY);
	oldMidPt = oldPt;
	var midPt = new createjs.Point(oldPt.x + e.localX >> 1, oldPt.y + e.localY >> 1);
	
	//draw locally
	drawDot(midPt);
	//draw to server broadcast to other clients
	socket.emit("drawDot", midPt);
	
	stage.addEventListener("stagemousemove", mouseMoveHandler);
}

function mouseMoveHandler(e){
	var midPt = new createjs.Point(oldPt.x + e.localX >> 1, oldPt.y + e.localY >> 1);
	
	//draw locally
	drawLine(midPt.x, midPt.y, oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
	//draw to server broadcast to other clients
	socket.emit("drawLine", {mpx:midPt.x, mpy:midPt.y, opx:oldPt.x, opy:oldPt.y, ompx:oldMidPt.x, ompy:oldMidPt.y});
	
	oldPt.x = e.localX;
	oldPt.y = e.localY;
	
	oldMidPt.x = midPt.x;
	oldMidPt.y = midPt.y;
}

function mouseUpHandler(){
	stage.removeEventListener("stagemousemove", mouseMoveHandler);
}

function drawDot(mp){
	drawingCanvas.graphics.clear().beginFill(color).drawCircle(mp.x, mp.y, stroke >> 1).endFill();
	stage.update();
}

function drawLine(origX, origY, oldX, oldY, oldMidX, oldMidY){
	drawingCanvas.graphics.clear().setStrokeStyle(stroke, "round", "round").beginStroke(color).moveTo(origX, origY).curveTo(oldX, oldY, oldMidX, oldMidY).endStroke();
	stage.update();
}

function clearDrawing(){
	stage.clear();
}
