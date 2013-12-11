/*
* Express
*/

var express = require('express'),
	path = require('path'),
	http = require('http'),
	app = express();

var bus = require('./bus');

var Debug = {
    log: function (msg) {
        console.log(new Date().toJSON() +": "+ msg);
    }
};

// Configuration

app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    // app.use(express.logger('short'));
    app.use(express.json());
	app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/',  function(req, res) {
	res.sendfile('public/index.html');
});

app.get('/arduino',  function(req, res) {
	Debug.log("Electric paint: "+ req.query.value);
	bus.emit('arduino', req.query.value);
	res.end("OK");
});

var server = http.createServer(app).listen(app.get('port'), function(){
  	Debug.log("Express server listening on port "+ app.get('port') +" in "+ app.get('env') +" mode.");
});

/*
* Socket.IO
*/

var	io = require('socket.io').listen(server),
	Player = require('./public/js/Player.js').Player,
	players = [],
 	totPlayers = 0;

io.configure(function() {
	io.enable('browser client minification');
	io.set('log level', 1);
});

function getPlayerById(id) {
	var length = players.length;
	for(var i = 0; i < length; i++) {
		if (players[i].id == id) {
			return players[i];
		}
	}

	return null;
}

function newPlayer(client) {
	p = new Player(client.id);
	players.push(p);

	client.emit('join', { player: p });
	client.broadcast.emit('newplayer', { player: p });

	Debug.log('+ New player: '+ p.nick);
}

function sendPlayerList(client) {
	client.emit('playerlist', { list: players });
	Debug.log('* Sent player list to '+ client.id);
}

io.sockets.on('connection', function(client) {
	newPlayer(client);
	sendPlayerList(client);

	totPlayers++;
	Debug.log('+ Player '+ client.id +' connected, total players: '+ totPlayers);

	io.sockets.emit('tot', { tot: totPlayers });

	client.on('disconnect', function() {
		var quitter = '';

		var length = players.length;
		for(var i = 0; i < length; i++) {
			if (players[i].id == client.id) {
				quitter = players[i].nick;
				players.splice(i, 1);
				break;
			}
		}

		totPlayers--;
		client.broadcast.emit('quit', { id: client.id });
		io.sockets.emit('tot', { tot: totPlayers });
		Debug.log('- Player '+ quitter +' ('+ client.id +') disconnected, total players: '+ totPlayers);
	});
});

var intervals = [
{
	min: 0,
	max: 100,
	status: 0,
	label: "nessuno"
},
{
	min: 100,
	max: 200,
	status: 1,
	label: "basso"
},
{
	min: 200,
	max: 500,
	status: 3,
	label: "alto"
},
{
	min: 500,
	max: 1000000,
	status: 4,
	label: "altissimo"
}
];

function generateStatusFromValue(value) {
	var result = {}; // TODO what if value is outside intervals range?

	intervals.forEach(function(interval) {
		if ((value > interval.min) && (value <= interval.max)) {
			// Debug.log(interval.min +" < "+ value +" <= "+ interval.max +" => "+ interval.status +" ( "+ interval.label +" )");
			
			result = {
				status: interval.status,
				label: interval.label,
				value: value
			};
			// break;
		}
	});

	return result;
}

function generateIntStatusFromValue(value) {
	var result = {}; // TODO what if value is outside intervals range?

	intervals.forEach(function(interval) {
		if ((value > interval.min) && (value <= interval.max)) {
			// Debug.log(interval.min +" < "+ value +" <= "+ interval.max +" => "+ interval.status +" ( "+ interval.label +" )");
			
			result = interval.status;
			// break;
		}
	});

	return result;
}

var stableValueTimeout = null;
var valuesArray = [];

// Returns the element with the highest occurrence
function mode(array) {
    if(array.length == 0)
    	return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
    	var el = array[i];
    	if(modeMap[el] == null)
    		modeMap[el] = 1;
    	else
    		modeMap[el]++;	
    	if(modeMap[el] > maxCount)
    	{
    		maxEl = el;
    		maxCount = modeMap[el];
    	}
    }
    return maxEl;
}

function guessStableValue() {
	var stableStatus;

	// if (valuesArray.length > 0) {
		// console.log(JSON.stringify(valuesArray));

		stableStatus = mode(valuesArray);

		if (stableStatus !== null) {
			console.log("stableStatus: "+ stableStatus);
		}

		valuesArray = [];

		io.sockets.emit('arduino', { value: stableStatus });
	// }

	startStableValueTimeout();
	
}

function startStableValueTimeout(value) {

	stableValueTimeout = setTimeout(function() { guessStableValue() }, 5000);

}

bus.on('arduino', function(value) {

	valuesArray.push(generateIntStatusFromValue(value));

});

// var frasi = require('./frasi.json');
// console.log(JSON.stringify(frasi));


startStableValueTimeout();