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