/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Engine = __webpack_require__(1);
	var ColorPicker = __webpack_require__(7);
	window.canvasParent = 'phaser';
	var roomId 		= document.getElementById('roomId').value;
	var nickname 	= document.getElementById('nickname').value;
	var thumbnail 	= document.getElementById('thumbnail').value;
	var scoreBoard 	= document.getElementById('scoreBoard');
	var dialog 		= document.getElementById('message_box_div');   
	var colorCanvas = document.getElementById('color_picker');


	var engine = new Engine();
	var img = new Image();
	img.src = 'colorPicker.jpg';
	var colorPicker = new ColorPicker(colorCanvas, img);

	window.player = null;
	window.eraser = false;
	window.clear = false;
	window.resize = false;
	window.level = null;
	window.scale = 1.3;
	$('#eraser').click(function(){
		if(eraser == true){
			$('#eraser').val('eraser');
			eraser = false;
		}
		else{
			$('#eraser').val('brush');
			eraser = true;
		}
	});
	$('#clear').click(function(){
	    if(engine.room.player.turn == true){
			clear = true;
			engine.network.sendMessage('clear', '');
	    }
	});
	$('#color_picker_button').click(function(){
		$('#color_picker').toggle();
	});
	$('#problem_button').hide();
	$('#problem_box').keydown(function(event){
	    if(event.which == 13){
	        engine.network.sendMessage('send answer', {answer : $('#problem_box').val()});
	        $('#problem_box').val('');
	        $('#problem_box').blur();
	        $('#problem_modal').modal('hide');
	        $('#problem_button').hide();
	    }
	});
	$('#problem_box_button').click(function(){
	    engine.network.sendMessage('send answer', {answer : $('#problem_box').val()});
	    $('#problem_box').val('');
	    $('#problem_box').blur();
	    $('#problem_modal').modal('hide');
	    $('#problem_button').hide();  
	});
	window.setInterval(function() {
	  var elem = document.getElementById('chat_div');
	  elem.scrollTop = elem.scrollHeight;
	}, 1000);
	window.yourTurn = true;
	init();
	function init(){
			engine.network.setConnection(roomId);
		setRoomInfo();
		Sketch.create({
	       container: document.getElementById( 'sketch' ),
	        autoclear: false,
	        setup: function() {
	            console.log( 'setup' );
	        },
	        resize : function(){
	            resize = true;
	        },
	        update: function() {
	            brushSize = (2 + abs( sin( this.millis * 0.003 ) * 20 )) * (1/800000);
	            if(resize == true)
	            {
	                for(var i=0; i< engine.room.paints_backup.length; i++){
	                    var paint = engine.room.paints_backup[i];
	                    this.lineCap = 'round';
	                    this.lineJoin = 'round';
	                    this.fillStyle = this.strokeStyle = paint.rgba;
	                    this.lineWidth = paint.brushSize * window.innerWidth * window.innerHeight;
	        
	    
	                    this.beginPath();
	                    this.moveTo( paint.oldX * window.innerWidth, paint.oldY * window.innerHeight);
	                    this.lineTo( paint.x* window.innerWidth, paint.y * window.innerHeight);
	                    this.stroke();
	                }
	                resize = false;
	            }
	            for(var i=0; i< engine.room.paints.length; i++){
	        		var paint = engine.room.paints[i];
	                this.lineCap = 'round';
	                this.lineJoin = 'round';
	                this.fillStyle = this.strokeStyle = paint.rgba;
	                this.lineWidth = paint.brushSize * window.innerWidth * window.innerHeight;
	    

	                this.beginPath();
	                this.moveTo( paint.oldX * window.innerWidth, paint.oldY * window.innerHeight);
	                this.lineTo( paint.x* window.innerWidth, paint.y * window.innerHeight);
	                this.stroke();
	   			}
	    		engine.room.paints = [];
	            if(clear == true){
	            	this.clear();
	                engine.room.paints_backup = [];
	            	clear = false;
	            }
	        },

	        touchmove: function() {
	            for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
	               if(this.dragging == true){  
	                    if(engine.room.player.turn == true){  
	                        touch = this.touches[i];
	                        this.lineCap = 'round';
	                        this.lineJoin = 'round';
	                        if(eraser == true){
	                        	this.fillStyle = this.strokeStyle = 'rgba(255,255,255,1)';
	                        	this.lineWidth = brushSize * window.innerWidth * window.innerHeight * 5;
	                        	engine.room.sendPaint(touch.ox/window.innerWidth,
	    				    		touch.oy/window.innerHeight,
	    				    		touch.x/window.innerWidth,
	    				    		touch.y/window.innerHeight,
	    				    		'rgba(255,255,255,1)',
	    				    		this.lineWidth/(window.innerWidth * window.innerHeight));
	                	   }
	                	   else{
	                	   	this.fillStyle = this.strokeStyle = colorPicker.rgba;
	                	   	this.lineWidth = brushSize * window.innerWidth * window.innerHeight;
	                        	engine.room.sendPaint(touch.ox/window.innerWidth,
	    				    		touch.oy/window.innerHeight,
	    				    		touch.x/window.innerWidth,
	    				    		touch.y/window.innerHeight,
	    				    		colorPicker.rgba,
	    				    		this.lineWidth/(window.innerWidth * window.innerHeight));                		
	                	   }
	                        this.beginPath();
	                        this.moveTo( touch.ox, touch.oy );
	                        this.lineTo( touch.x, touch.y );
	                        this.stroke();
	                    }
	                    else{

	                    }
	               }
	            }
	        }
	    });

	}
	function setRoomInfo(){
		if(roomId != null){
			roomId = roomId.value;
			engine.room.setRoomId(roomId);
			if(nickname != null)
			{ 
				engine.room.setPlayer(nickname, thumbnail);
				var player = engine.room.getPlayer();
				engine.network.joinRoom(player);
				engine.room.createScoreBoard(scoreBoard);
				engine.room.createDialog(dialog);
			}
		}
	}



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Network = __webpack_require__(2);
	var Room = __webpack_require__(3);
	var Timer = __webpack_require__(6);
	//var EventHandler = require('./eventHandler');
	var Engine = function(){
		engine = this;
		this.timer = new Timer();
		this.network = new Network();
		this.room = new Room();
	};

	Engine.prototype.constructor = Engine;

	Engine.prototype = {
		setCanvas : function(parent){
			var div = document.getElementById(parent);
	 		canvas =  div.getElementsByTagName("canvas")[0];
	 		ctx = canvas.getContext('2d'); 
		}
	}


	module.exports = Engine;

/***/ },
/* 2 */
/***/ function(module, exports) {

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
	    			network.socket.emit('change turn');
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
	    			network.socket.emit('change turn');
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(4);
	var Paint  = __webpack_require__(5)
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	var Paint = function(oldX, oldY, x, y, rgba, brushSize){
		this.oldX = oldX;
		this.oldY = oldY;
		this.x = x;
		this.y = y;
		this.rgba = rgba;
		this.brushSize = brushSize;
	};

	Paint.prototype.constructor = Paint;

	Paint.prototype = {
	};

	module.exports = Paint;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var Timer = function(){
	    this.interval = null;
	};
	Timer.prototype.constructor = Timer;
	Timer.prototype = {
	    dailyMissionTimer : function(duration){     
	       var timer = duration * 3600;
	       var hours, minutes, seconds;
	       
	       this.interval = setInterval(function(){
	           hours   = parseInt(timer / 3600, 10);
	           minutes = parseInt(timer / 60 % 60, 10);
	           seconds = parseInt(timer % 60, 10);
	           
	           hours   = hours < 10 ? "0" + hours : hours;
	           minutes = minutes < 10 ? "0" + minutes : minutes;
	           seconds = seconds < 10 ? "0" + seconds : seconds;
	           
	           $('#time-hour').text(hours + ' ');
	           $('#time-min').text(minutes+ ' ');
	           $('#time-sec').text(seconds+ ' ');

	           if (--timer < 0) {
	               timer = 0;
	               clearInterval(this.interval);
	           }
	       }, 1000);
	   }
	    
	};


	module.exports = Timer; 

/***/ },
/* 7 */
/***/ function(module, exports) {

	var ColorPicker = function(canvas, image){
		colorPicker = this;
		console.log(canvas);
		this.ctx = canvas.getContext('2d');
		console.log(this.ctx);
		$(image).on('load', function(){
			canvas.width = image.width;
			canvas.height = image.height;
			colorPicker.ctx.drawImage(image,0, 0, image.width, image.height);	
			$('#color_picker').click(function(event){
			  // getting user coordinates
			  var x = event.pageX - this.offsetLeft;
			  var y = event.pageY - this.offsetTop;
			  // getting image data and RGB values
			  var img_data = colorPicker.ctx.getImageData(x, y, 1, 1).data;
			  var R = img_data[0];
			  var G = img_data[1];
			  var B = img_data[2];  
			  colorPicker.rgba = 'rgba('+R + ',' + G + ',' + B + ',' + '1)';
			  console.log(colorPicker.rgba);
			  // convert RGB to HEX
			  // making the color the value of the input
			});
		});
		this.rgba = 'rgba(0, 0, 0, 0.8)';
		$('#color_picker').hide();
		//$('#color_picker').show();

	};

	ColorPicker.prototype.constructor = ColorPicker;

	ColorPicker.prototype ={

	};

	module.exports = ColorPicker;

/***/ }
/******/ ]);