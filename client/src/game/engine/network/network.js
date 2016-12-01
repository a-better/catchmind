var Network = function(){
	this.socket;
	this.roomId
	network = this;
};

Network.prototype.Constructor = Network;

Network.prototype = {
	setConnection : function(roomId){
		var domain = document.domain;
		var port = location.port;
		var url = "http://"+domain+":"+port;
		this.roomId = roomId;
		console.log(url);
		this.socket = io(url);
		console.log(this.socket.io.engine.id); 
		this.setEventHandlers();
	},
	getSocket : function(){
		return this.socket;
	},  
 	setEventHandlers : function(){
 	  this.socket.on('add player', network.onAddPlayer);
 	  this.socket.on('remove player', network.onRemovePlayer);
 	  this.socket.on('chat', network.onChat);
 	  this.socket.on('send room info', network.onSendRoomInfo);
 	  this.socket.on('paint', network.onPaint);
 	  this.socket.on('clear canvas', network.onClearCanvas);
 	  this.socket.on('send', network.onSend);
 	  this.socket.on('broadcast', network.onBroadcast);
 	},
	joinRoom : function(player){
		if(this.roomId != null){
			//engine.room.setRoomId();
			this.socket.emit('join room', {roomId : this.roomId, nickname : player.nickname, thumbnail : player.thumbnail});
		}
	},
	sendMessage : function(tag, data){
		if(this.roomId != null){
			this.socket.emit('send message',{tag : tag, roomId : this.roomId, contents : data});
		}
		else if(data === undefined){
			this.socket.emit('send message',{tag : tag, roomId : this.roomId});
		}
	},
	onAddPlayer : function(data){
		engine.room.addRemotePlayer(data.contents.nickname, data.contents.thumbnail, data.id);
		engine.room.createScoreBoard(scoreBoard);
	},
	onChat : function(data){
		//console.log(data);
		engine.room.addChat(data);
	},
	onSendRoomInfo : function(data){
		var objectData = JSON.parse(data);
		engine.room.init(objectData);
	},
  	onPaint  : function(data){
    	console.log('receive'+data.x + '|'+data.y +'|'+ data.rgba);
    	engine.room.receivePaint(data.oldX, data.oldY, data.x, data.y, data.rgba, data.brushSize);
    },
    onClearCanvas : function(){
    	clear = true;
    },
    onRemovePlayer : function(data){
    	engine.room.removeById(data.id);
    	engine.room.createScoreBoard(scoreBoard);
    },
    onSend : function(data){
    	if(data.tag == 'send_turn'){
    		$('#problem_button').show();
    		engine.room.player.turn = true;
    		$('#chat_div').append('당신의 턴입니다. 문제를 출제해주세요'+'<br/>');
    	}
    	else if(data.tag =='send paints'){
    		var objectData = JSON.parse(data.contents);
    		engine.room.paints = objectData;
    	}
    },
    onBroadcast : function(data){
    	if(data.tag == 'broadcast_startgame'){
    		$('#chat_div').append('게임 시작!'+'<br/>');
    		engine.timer.dailyMissionTimer(data.contents.timeout/3600);
    	}
    	else if(data.tag == 'broadcast_setanswer'){
    		$('#chat_div').append('문제가 제출되었습니다 맞춰주세요!'+'<br/>');
    		clearInterval(engine.timer.interval);
    		engine.timer.dailyMissionTimer(data.contents.timeout/3600);
    	}
    	else if(data.tag == 'broadcast_endgame'){
    		$('#chat_div').append('아무도 답을 맞추지 못했습니다 답 : ' +data.contents.answer+'<br/>');
    		if(engine.room.player.turn == true){
    			//network.socket.emit('change turn');
   				setTimeout(function(){
    				clear = true;
					engine.network.sendMessage('clear', '');
    			}, data.contents.gameInterval * 1000);
    			engine.room.player.turn = false;
    			$('#problem_button').hide();
    		}
    		clearInterval(engine.timer.interval);
    	}
    	else if(data.tag == 'broadcast_correct'){
    		$('#chat_div').append('누군가 답을 맞췃습니다.!  답 : ' +data.contents.answer+'<br/>');
    		//$('#chat_div').append('게임 종료!' + '답 : ' +data.contents.answer+'<br/>');
    		if(engine.room.player.turn == true){
    			//network.socket.emit('change turn');
    			setTimeout(function(){
    				clear = true;
					engine.network.sendMessage('clear', '');
    			}, data.contents.gameInterval * 1000);
    			engine.room.player.turn = false;
    			$('#problem_button').hide();
    		}
    		clearInterval(engine.timer.interval);		
    	}
    }

};

module.exports = Network;