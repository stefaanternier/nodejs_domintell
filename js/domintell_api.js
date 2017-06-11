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
}
login();

exports.appinfo = function () {
    send('APPINFO');
}

exports.lights = function (id) {
    send('BIR  ' + id);
}

exports.dim = function (id, perc) {
    send('DIM  ' + id+'%D'+perc);
}


exports.screens = function (id) {
    send('TRV  ' + id);
}


exports.ping = function (id) {
    send('PING');
}

client.on('message', (msg, rinfo) => {
    console.log('from domintell: '+msg)
	//firebase.dom_event(msg);
});