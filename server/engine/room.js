var Player = require('./player');
var Paint = require('./paint');
var Room = function(thisId, linkKey, url){
	this.id = thisId;
	this.linkKey = linkKey;
	this.url = url;
	this.paints = [];
	this.nextPlayer = null;
	this.players = [];
	this.turn = 0;
	this.answer = '';
	this.round = null;
	this.timeout = 30;
	this.timeout_solve = 120;
	this.gameInterval = 5;
	this.minPlayerNum = 2;
	this.playing = false;
	room = this;
};

Room.prototype.constructor = Room;

Room.prototype = {
	addPlayer : function(id, nickname, thumbnail){
		var player = new Player(id, nickname, thumbnail);
		this.players.push(player);
	},
	addPaint : function(oldX, oldY, x, y, rgba, brushSize){
	    var paint = new Paint(oldX, oldY, x, y, rgba, brushSize);
	    this.paints.push(paint); 
	},
	removeById : function(id){
		for(var i = this.players.length - 1; i >= 0; i--) {
		    if(this.players[i].id === id) {
		       this.players.splice(i, 1);
		    }
		}
		return this.players;
	},
	startGame : function(){
		this.players[this.turn].turn = true;
	},
	endGame : function(){
		//console.log("this.id: 41 line  " + this.id)
		//console.log("this.turn this : 42 line  " + this.turn)
		//console.log("this.players.lenght : this 43 line " + this.players.length);
		this.players[this.turn].turn = false;
		this.turn++;
		if(this.turn >= this.players.length){
			this.turn = 0;
		}
	},
	checkAnswer : function(playerId, answer){
		if(this.answer == answer && this.answer != ''){
			return true;
		}
		else{
			return false;
		}
	},
	addScore : function(playerId){
		for(var i=0; i<this.players.length; i++){
			if(this.players[i].id == playerId && this.players[i].turn == false){
				this.players[i].score ++;
				this.nextPlayer = this.players[i];
				return true;
			}
		}
		return false;
	},
	searchPlayerById : function(playerId){
		for(var i=0; i<this.players.length; i++){
			if(this.players[i].id == playerId){
				return this.players[i];
			}
		}
		return false;
	},
	clearGame : function(){
		if(this.nextPlayer != null){
			var nextPlayerTurn = this.searchPlayerTurn(this.nextPlayer.id);
			if(nextPlayerTurn >= this.players.length || nextPlayerTurn == -1){
				this.nextPlayer = null;
				this.paints = [];
				this.answer = '';
				if(this.turn >= this.players.length){
					this.turn = 0;
				}
			}
		}
		else{
			this.paints = [];
			this.answer = '';
			if(this.turn >= this.players.length){
				this.turn = 0;
			}
		}

		if(this.players.length == 0){
			this.players = [];
		}

	},		
	searchPlayerTurn : function(playerId){
		for(var i=0; i<this.players.length; i++){
			if(this.players[i].id == playerId){
				return i;
			}
		}
		return -1;
	}	
};

module.exports = Room;