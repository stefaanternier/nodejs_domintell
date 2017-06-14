var admin = require("firebase-admin");

var serviceAccount = require("./terniersolutions-firebase-adminsdk.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://terniersolutions.firebaseio.com"
});

// The app only has access as defined in the Security Rules
var db = admin.database();
var eventsref = db.ref("/events");

eventsref.set({
	time: "now",
	eventname: "test"
});

exports.dom_event = function (message) {
	eventsref.push().set({
		time: new Date().getTime(),
		eventname: message.toString()
	});
}
exports.record_module_description = function(id, desc) {
	var ref = db.ref("modules");
	
	var object = {};
	object[id] = desc;
	ref.update(object);
}

exports.record_event = function(id, status) {
    var ref = db.ref("status");
	if (status == 1) {status = true}else {status = false}
	var object = {};
	object[id] = status;
	ref.update(object);
}

//exports.record_event('testid2', 'value');