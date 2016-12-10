var Network = function(engine){
	this.engine = engine;
	network = this;
	roomId = 0;
};

Network.prototype.Constructor = Network;

Network.prototype = {
	setConnection : function(server){
		io = require("socket.io").listen(server);
		console.log("listen catchmind");
	},
	setEventHandlers: function(){
		io.on("connection", function(client) {
			console.log('connected !'+ ':'+ client.id);
			client.on("create room", network.onCreateRoom);
			client.on("join room", network.onJoinRoom);
			client.on("check room", network.onCheckRoom);
			client.on("send message", network.onSendMessage);
			client.on("disconnect", network.onClientDisconnect);
			//client.on('change turn', network.onChangeTurn);
			//client.on("send data", this.onSendData);
		});
	},
	onCreateRoom : function(data){
		network.engine.createRoom(roomId);
		network.sendRoomById(this.id, roomId);
		roomId++;			
	},
	sendRoomById :function(clientId, roomId){
	   	var room = network.engine.searchRoomById(roomId);	
		io.to(clientId).emit('send room', {room : room});
	},
	onJoinRoom : function(data){
		this.roomId = data.roomId;
		this.join(data.roomId);
		//var room = io.sockets.adapter.rooms[data.roomId];
		network.sendRoomInfo(this.id, data.roomId);
		//console.log('engine.onJoinRoom 38 line roomId : ' + data);
		var room = network.engine.searchRoomById(data.roomId);
		if(!room){
			network.engine.createRoom(data.roomId);
		}
		network.engine.addPlayer(this.id, data, room);
		this.broadcast.to(data.roomId).emit('add player',{id : this.id, contents : data});
		//console.log('player Number: ' + room.length);
	},
	onSendMessage : function(data){
		//console.log(data.contents);
		if(data.tag == 'paint'){
			var room = network.engine.searchRoomById(data.roomId);
			var paint = data.contents;	
			room.addPaint(paint.oldX, paint.oldY, paint.x, paint.y, paint.rgba, paint.brushSize);
			this.broadcast.to(data.roomId).emit('paint', paint);
		}
		else if(data.tag == 'chat'){
			console.log(data.contents);
			this.broadcast.to(data.roomId).emit('chat', data.contents);
			var room =  network.engine.searchRoomById(data.roomId);
			network.engine.checkAnswer(room, this.id, data.contents.text);
		}
		else if(data.tag == 'clear'){
			var room =  network.engine.searchRoomById(data.roomId);	
			room.paints = [];
			this.broadcast.to(data.roomId).emit('clear canvas');
		}
		else if(data.tag == 'send answer'){
			 var room =  network.engine.searchRoomById(data.roomId);
			 network.engine.setAnswer(room, data.contents.answer);
		}
		else if(data.tag =='request paints'){
			var paints =  network.engine.getPaints(data.roomId);
			var jsondata = JSON.stringify(paints);
			network.sendMessage(this.id, data.roomId, 'send paints', jsondata);
		}
	},
	sendRoomInfo : function(clientId, roomId){
		var room =  network.engine.searchRoomById(roomId);
		var jsondata = JSON.stringify(room);
		console.log(jsondata);
		io.to(clientId).emit('send room info', jsondata);
	},
	onClientDisconnect : function(){
		console.log('onClientDisconnect roomId: ' + this.roomId);
		if(typeof this.roomId != 'undefined'){
			var room = engine.searchRoomById(this.roomId);
			network.engine.removePlayer(room, this.id);
			this.leave(this.roomId);
			this.broadcast.to(this.roomId).emit('remove player', {id : this.id});
		}
	},
	sendMessage : function(id, roomId, tag, contents){
		if(contents === undefined){
			io.to(id).emit('send', {tag : tag});
		}
		else{
			io.to(id).emit('send', {tag : tag, contents : contents});
		}	
	},
	broadcastMessage : function(roomId, tag, contents){
		if(contents === undefined){
			io.sockets.in(roomId).emit('broadcast', {tag : tag});
		}
		else{
			io.sockets.in(roomId).emit('broadcast', {tag : tag, contents : contents});
		}
	},
	onCheckRoom : function(data){
		var room =  network.engine.searchRoomById(data.roomId);
		if(room == false){
			io.to(this.id).emit('no exist');
		}
		else{
			io.to(this.id).emit('exist');
		}
	}
};

module.exports = Network;
