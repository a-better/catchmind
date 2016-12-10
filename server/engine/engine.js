var Network = require('./network/network');
var Room = require('./room');
var Engine = function(){
	this.network = new Network(this);
	this.rooms = {};
	this.rounds = {};
	engine  = this;
};

Engine.prototype.constructor = Engine;

Engine.prototype = {
	createRoom : function(roomId){
		var room = new Room(roomId);
		engine.rooms[roomId] = room;
	},
	addPlayer : function(id, data, room){
		var roomId = data.roomId;
		//var room = searchRoomById(data.roomId);
		console.log('addPlayer 18 line : data.roomId' + data.roomId );
		console.log('addPlayer 19 line : room.id' + room.id);
		room.addPlayer(id, data.nickname, data.thumbnail);
		if(room.players.length >= room.minPlayerNum && room.playing == false){
			room.playing = true;
			setTimeout(function(){
				if(room.playing == true){
					engine.startGame(room);
				}
			}, room.gameInterval*1000);		
		}
		console.log('addPlayer 26 line : room.players' + room.players.length);
	},
	removePlayer : function(room, id){
				
		room.removeById(id);
		console.log('engine.removePlayer line 29 playerNum : ' + room.players.length);
		if(room.players.length < room.minPlayerNum  && room.playing == true){
			clearTimeout(engine.rounds[room.id]);
			room.clearGame();		
			room.endGame();
			engine.network.broadcastMessage(room.id, 'broadcast_endgame', {answer : room.answer, gameInterval : room.gameInterval});
			room.playing = false;
		}
		if(room.players.length == 0){
			console.log('engine.removePlayer line 39 roomId : ' + roomId);
			engine.removeById(roomId); 
		}
	},
	startGame : function(room){
		//console.log('rooms[index]  :' + roomId +  '/'+index+ '/' + room + '/' + rooms[index]);
		room.clearGame();
		room.startGame();
		clearTimeout(engine.rounds[room.id]);
		var round = setTimeout(
			function(){
				room.nextPlayer = null;
				room.clearGame();
				room.endGame();
				//console.log('gameEnd : roomId'+room.id);
				engine.network.broadcastMessage(room.id, 'broadcast_endgame',{answer : room.answer, gameInterval : room.gameInterval});
				setTimeout(function(){
					if(room.playing == true){
						engine.startGame(room);
					}
				}, room.gameInterval*1000);			
			}
			, room.timeout * 1000);
		engine.rounds[room.id] = round;
		var player;
		if(room.nextPlayer != null)
		{
			if(room.searchPlayerById(room.nextPlayer.id)){
				player =room.nextPlayer;
			}
		}
		else{
			player = room.players[room.turn];
		}	
		this.network.broadcastMessage(room.id, 'broadcast_startgame', {nickname : player.nickname, timeout : room.timeout});
		this.network.sendMessage(player.id, room.id, 'send_turn');
	},
	setAnswer : function(room, answer){
		room.answer = answer;
		clearTimeout(engine.rounds[room.id]);
		var round = setTimeout(
			function(){
				room.nextPlayer = null;		
				room.clearGame();
				room.endGame();
				console.log('gameEnd : roomId'+room.id);
				engine.network.broadcastMessage(room.id, 'broadcast_endgame',{answer : answer, gameInterval : room.gameInterval});
				var roomId = room.id;
				setTimeout(function(){
					if(room.playing == true){
						engine.startGame(room);
					}
				}, room.gameInterval*1000);
			}
			, room.timeout_solve * 1000);
		engine.rounds[room.id] = round;
		network.broadcastMessage(room.id, 'broadcast_setanswer', {timeout : room.timeout_solve});
	},
	checkAnswer : function(room, playerId, answer){
		var player = room.searchPlayerById(playerId);
		if(room.checkAnswer(playerId, answer)){
			if(room.addScore(playerId)){
				engine.endGame(room, player, answer);
			}
		}
	},
	endGame : function(room, player, answer){
		clearTimeout(engine.rounds[room.id]);
		engine.network.sendMessage(player.id, room.id, 'send_correct');
		engine.network.broadcastMessage(room.id, 'broadcast_correct',{id : player.id, answer : room.answer, gameInterval : room.gameInterval});
		room.clearGame();
		room.endGame();
		setTimeout(function(){
			if(room.playing == true){
				engine.startGame(room);
			}
		}, room.gameInterval*1000);
	},
	searchRoomById : function(roomId){
		if(engine.rooms[roomId] === undefined){
			return false;
		}
		else{
			return engine.rooms[roomId];
		}
	},
	getPaints : function(roomId){
		var room = engine.searchRoomById(roomId);
		return room.paints;
	},
	removeById : function(id){
		delete engine.rooms[id];
		return engine.rooms;	
	}
};

module.exports = Engine;