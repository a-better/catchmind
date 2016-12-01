var Player = require('./player');
var Paint  = require('./paint')
var Room = function(){
	room = this;
	this.id = null;
	this.paints_backup = [];
	this.paint = null;
	this.paints = [];
	this.player = null;
	this.remotePlayers = [];
};

Room.prototype.constructor = Room;

Room.prototype = {
	sendPaint  : function(oldX, oldY, x, y, rgba, brushSize){
		var paint = new Paint(oldX, oldY, x, y, rgba, brushSize);
		engine.network.sendMessage('paint', {oldX : oldX, oldY : oldY, x : x, y :y, rgba : rgba, brushSize : brushSize});
		this.paints_backup.push(paint);
	},
	receivePaint : function(oldX, oldY, x, y, rgba, brushSize){
		var paint = new Paint(oldX, oldY, x, y, rgba, brushSize);
		this.paints.push(paint);
		this.paints_backup.push(paint);
	},
	init : function(data){
		room.remotePlayers = data.players;
		room.paints = data.paints;	
		room.paints_backup = data.paints;
		room.createScoreBoard(scoreBoard);
	},
	setPlayer : function(nickname, thumbnail){
		this.player = new Player(nickname, thumbnail);
	},
	getPlayer : function(){
		return this.player;
	},
	addRemotePlayer : function(nickname, thumbnail, id){
		var player = new Player(nickname, thumbnail, id);
		this.remotePlayers.push(player);
		console.log(this.remotePlayers);
		return player;
	},
	setRoomId : function(roomId){
		this.id = roomId;
	},
	createScoreBoard : function(container){
		container.innerHTML = '';
		container.innerHTML += '<img id="thumbnail" src='+this.player.thumbnail+'>'
		container.innerHTML += this.player.nickname;
		container.innerHTML += '</br>';
		for(var i=0; i<this.remotePlayers.length; i++)
		{
			container.innerHTML += '<img id="thumbnail" src='+this.remotePlayers[i].thumbnail+'>'
			container.innerHTML += this.remotePlayers[i].nickname;
			container.innerHTML += '</br>';
		}
	},
	createDialog : function(container){	
		var chat = document.getElementById("message_box");
		$('#message_box').keydown(function(event){
			if(event.which == 13){
				room.player.talkToRoom($('#message_box').val());
				room.addChat({nickname : room.player.nickname, text : $('#message_box').val()});
				$('#message_box').val('');
				$('#message_box').blur();
			}
		});
		$('#message_button').click(function(){
			room.player.talkToRoom($('#message_box').val());
			room.addChat({nickname : room.player.nickname, text : $('#message_box').val()});
			$('#message_box').val('');
			$('#message_box').blur();
		});
	},
	addChat : function(data){
		$('#chat_div').append(data.nickname +':'+ data.text+'<br/>');
	},
	removeById : function(id){
		for(var i = this.remotePlayers.length - 1; i >= 0; i--) {
		    if(this.remotePlayers[i].id === id) {
		       this.remotePlayers.splice(i, 1);
		    }
		}
		return this.remotePlayers;
	},
	searchPlayerById : function(playerId){
		for(var i=0; i<this.players.length; i++){
			if(this.players[i].id == playerId){
				return this.players[i];
			}
		}
	}
};

module.exports = Room;