
//엔트리 애플리케이션 
//최초로 진입하는 애플리케이션 
var express = require('express');
var Engine = require('./engine/engine');
 
var bodyParser = require('body-parser'); 
var app		= express();
var server = app.listen(4010);
app.use(bodyParser.urlencoded({ extended: false }));

rooms = [];//setTimeOut은 재귀적으로 실행되기 때문에 전역 변수가 아니면 변수의 현재 상태를 받아 처리할수 없습니다. 

rounds = []; //setTimeOut은 재귀적으로 실행되기 때문에 전역 변수가 아니면 변수의 현재 상태를 받아 처리할수 없습니다. 
engine = new Engine();
engine.network.setConnection(server);


app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './client');

//client->lndex.html
app.use(express.static('client'));
init();

app.post('/:roomId', function(req, res){
	
	user_data = JSON.parse(req.body.user_data);
	url = req.body.url;
	key = req.body.key;
    roomId = req.params.roomId;
	console.log(user_data.properties);
	//console.log()
	if(!engine.searchRoomById(req.params.roomId)){
		engine.createRoom(req.params.roomId, key, url);
	}
	res.render('room', {roomId : req.params.roomId, 
		nickname : user_data.properties.nickname,
		thumbnail : user_data.properties.thumbnail_image,
		url : url,
		key : key
	});
});
function init() {
	engine.network.setEventHandlers();
	engine.network.setEventHandlers2();
	console.log("catch mind init");
	//engine.socket.setBroadcastingLoop();

	// Start game loop
	//setInterval(broadcastingLoop, updateInterval);
};



function onClientDisconnect() {
	//클라이언트가 끊겻을떄, leave pending game이나 remove player 같은걸 실행해줘야함. 
}
