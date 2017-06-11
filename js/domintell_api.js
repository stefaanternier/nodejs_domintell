var PORT = 17481;
var HOST = '192.168.1.200';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
exports.client = client;

client.on('message', (msg, rinfo) => {
	if (msg.toString().indexOf('INFO:Session timeout:INFO') !== -1) {
		console.log('time-out detected');
		login();
	} 	
});

var send = function(messageString) {
    var message = new Buffer(messageString);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
		console.log('Domintell command sent: ' + messageString);
	});
}

var login = function () {
    send('LOGIN');
	// var message = new Buffer('LOGIN');
	// client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
	// 	if (err) throw err;
	// 	console.log('Login message sent to ' + HOST + ':' + PORT);
	// });
}
login();

exports.appinfo = function () {
    send('APPINFO');
	// var message = new Buffer('APPINFO');
	// client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
	// 	if (err) throw err;
	// 	console.log('UDP message sent to ' + HOST + ':' + PORT);
	// });
}

exports.lights = function (id) {
	var message = new Buffer('BIR  ' + id);
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
		console.log('command:' + message.toString());
		console.log('Lights switch ' + HOST + ':' + PORT);
	});

}

exports.dim = function (id, perc) {
	var message = new Buffer('DIM  ' + id+'%D'+perc);
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
		console.log('command:' + message.toString());
		console.log('Lights switch ' + HOST + ':' + PORT);
	});

}


exports.screens = function (id) {
	var message = new Buffer('TRV  ' + id);
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
		console.log('command:' + message.toString());
		console.log('screen switch ' + HOST + ':' + PORT);
	});

}


exports.ping = function (id) {
	var message = new Buffer('PING');
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;

	});

}

client.on('message', (msg, rinfo) => {
    console.log('from domintell: '+msg)
	//firebase.dom_event(msg);
});