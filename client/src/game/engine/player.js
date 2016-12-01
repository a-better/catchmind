
var Player = function(nickname, thumbnail, id){
	this.id = id;
	this.nickname = nickname;
	this.thumbnail = thumbnail;
	this.turn = false;
	this.score = 0;
	//this.players = [];
};

Player.prototype.constructor = Player;

Player.prototype = {
	talkToRoom : function(text){
		engine.network.sendMessage('chat', {nickname : this.nickname, text : text});
	},
	talkToPlayer : function(container){
	}
};

module.exports = Player;