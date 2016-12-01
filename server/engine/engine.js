var Network = require('./network/network');
var Room = require('./room');
var Engine = function(){
	this.network = new Network();
};

Engine.prototype.constructor = Engine;

Engine.prototype = {
	createRoom : function(roomId){
		var room = new Room(roomId);
		rooms.push(room);
	},
	addPlayer : function(id, data){
		var index = engine.searchRoomIndexById(data.roomId);
		var roomId = data.roomId;
		//var room = searchRoomById(data.roomId);
		console.log('addPlayer 18 line : data.roomId' + data.roomId );
		console.log('addPlayer 19 line : room.id' + rooms[index].id);
		rooms[index].addPlayer(id, data.nickname, data.thumbnail);
		if(rooms[index].players.length >= rooms[index].minPlayerNum && rooms[index].playing == false){
			rooms[index].playing = true;
			setTimeout(function(){
				if(rooms[index].playing == true){
					engine.startGame(rooms[index].id);
				}
			}, rooms[index].gameInterval*1000);		
		}
		console.log('addPlayer 26 line : room.players' + rooms[index].players.length);
	},
	removePlayer : function(roomId, id){
		var index = engine.searchRoomIndexById(roomId);		
		rooms[index].removeById(id);
		console.log('engine.removePlayer line 29 playerNum : ' + rooms[index].players.length);
		if(rooms[index].players.length < rooms[index].minPlayerNum  && rooms[index].playing == true){
			clearTimeout(rounds[rooms[index].id]);
			rooms[index].clearGame();		
			rooms[index].endGame();
			engine.network.broadcastMessage(rooms[index].id, 'broadcast_endgame', {answer : rooms[index].answer, gameInterval : rooms[index].gameInterval});
			rooms[index].playing = false;
		}
		if(rooms[index].players.length == 0){
			console.log('engine.removePlayer line 39 roomId : ' + roomId);
			engine.removeById(roomId); 
		}
	},
	startGame : function(roomId){
		var index = this.searchRoomIndexById(roomId);
		var room = this.searchRoomById(roomId);
		console.log('rooms[index]  :' + roomId +  '/'+index+ '/' + room + '/' + rooms[index]);
		rooms[index].clearGame();
		rooms[index].startGame();
		var round = setTimeout(
			function(){
				rooms[index].nextPlayer = null;
				rooms[index].clearGame();
				rooms[index].endGame();
				console.log('gameEnd : roomId'+room.id);
				engine.network.broadcastMessage(room.id, 'broadcast_endgame',{answer : room.answer, gameInterval : room.gameInterval});
				setTimeout(function(){
					if(rooms[index].playing == true){
						engine.startGame(rooms[index].id);
					}
				}, rooms[index].gameInterval*1000);			
			}
			, room.timeout * 1000);
		rounds[room.id] = round;
		var player;
		if(rooms[index].nextPlayer != null)
		{
			if(rooms[index].searchPlayerById(room.nextPlayer.id)){
				player = rooms[index].nextPlayer;
			}
		}
		else{
			player = room.players[room.turn];
		}	
		this.network.broadcastMessage(room.id, 'broadcast_startgame', {nickname : player.nickname, timeout : room.timeout});
		this.network.sendMessage(player.id, room.id, 'send_turn');
	},
	setAnswer : function(roomId, answer){
		var index = this.searchRoomIndexById(roomId);	
		var room = this.searchRoomById(roomId);
		rooms[index].answer = answer;
		clearTimeout(rounds[room.id]);
		var round = setTimeout(
			function(){
				rooms[index].nextPlayer = null;		
				rooms[index].clearGame();
				rooms[index].endGame();
				console.log('gameEnd : roomId'+rooms[index].id);
				engine.network.broadcastMessage(room.id, 'broadcast_endgame',{answer : answer, gameInterval : room.gameInterval});
				var roomId = room.id;
				setTimeout(function(){
					if(rooms[index].playing == true){
						engine.startGame(rooms[index].id);
					}
				}, rooms[index].gameInterval*1000);
			}
			, room.timeout_solve * 1000);
		rounds[room.id] = round;
		network.broadcastMessage(room.id, 'broadcast_setanswer', {timeout : room.timeout_solve});
	},
	checkAnswer : function(roomId, playerId, answer){
		var index = engine.searchRoomIndexById(roomId);	
		var room = engine.searchRoomById(roomId);
		var player = room.searchPlayerById(playerId);
		if(rooms[index].checkAnswer(playerId, answer)){
			if(rooms[index].addScore(playerId)){
				engine.endGame(room, index, player, answer);
			}
		}
	},
	endGame : function(room, index, player, answer){
		clearTimeout(rounds[rooms[index].id]);
		engine.network.sendMessage(player.id, rooms[index].id, 'send_correct');
		engine.network.broadcastMessage(rooms[index].id, 'broadcast_correct',{id : player.id, answer : room.answer, gameInterval : room.gameInterval});
		rooms[index].clearGame();
		rooms[index].endGame();
		setTimeout(function(){
			if(rooms[index].playing == true){
				engine.startGame(rooms[index].id);
			}
		}, rooms[index].gameInterval*1000);
	},
	searchRoomById : function(roomId){
		for(var i=0; i < rooms.length; i++){
			if(rooms[i].id == roomId){
				return rooms[i];
			}
		}
		return false;
	},
	searchRoomIndexById : function(roomId){
		for(var i=0; i < rooms.length; i++){
			if(rooms[i].id == roomId){
				return i;
			}
		}
		return -1;
	},
	getPaints : function(roomId){
		var room = engine.searchRoomById(roomId);
		return room.paints;
	},
	removeById : function(id){
		for(var i = rooms.length - 1; i >= 0; i--) {
		    if(rooms[i].id == id) {
		    	console.log('engine line 144 : room.length / rooms.id / i ' + rooms.isArray +'/'+rooms.length + '/' + rooms[i].id + '/' + i);
		       rooms.splice(i, 1);
		    }
		}
		return rooms;
	}
};

module.exports = Engine;