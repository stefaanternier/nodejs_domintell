var restify = require('restify');
var domi = require('./domintell_api');

var server = restify.createServer({
    name: 'Nodejs Domintell gateway',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
    return next();
});

server.listen(8980, function () {
    console.log('%s listening at %s', server.name, server.url);
});


server.get('/appinfo', function (req, res, next) {
	domi.appinfo();
	res.send({'appinfo': 'send'});
	return next();
});

server.get('/lights/:id', function (req, res, next) {
	domi.lights(req.params.id);
	res.send('ok');
	return next();
});

server.get('/lights/:id/:status', function (req, res, next) {
	domi.lights(req.params.id+'%'+req.params.status);
	res.send('ok');
	return next();
});

server.get('/dimlights/:id/:perc', function (req, res, next) {
	domi.dim(req.params.id, req.params.perc)
	res.send('ok');
	return next();
});

//TRV  235F-3

server.get('/screens/:id', function (req, res, next) {
	domi.screens(req.params.id);
	res.send('ok');
	return next();
});

server.get('/ping', function (req, res, next) {
	domi.ping();
	res.send('ok');
	return next();
});

server.get('/logout', function (req, res, next) {
	domi.logout();
	res.send('ok');
	return next();
});

server.listen(8980, function () {
	console.log('%s listening at %s', server.name, server.url);
});