
var Player = function(id, nickname, thumbnail){
	this.id		  = id;
	this.nickname = nickname;
	this.thumbnail = thumbnail;
	this.turn = false;
	this.score = 0;
};

Player.prototype.constructor = Player;

Player.prototype = {
};

module.exports = Player;