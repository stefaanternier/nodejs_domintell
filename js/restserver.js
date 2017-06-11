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
