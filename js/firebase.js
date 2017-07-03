var admin = require("firebase-admin");

var serviceAccount = require("./terniersolutions-firebase-adminsdk.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://terniersolutions.firebaseio.com"
});

// The app only has access as defined in the Security Rules
const db = admin.database();
const eventsref = db.ref("/events");

exports.dom_event = function (message) {
	eventsref.push().set({
		time: new Date().getTime(),
		eventname: message.toString()
	});
}
exports.record_module_description = function(id, desc, dommodule) {
	var ref = db.ref("modules/"+dommodule);
	
	var object = {};
	object[id] = desc;
	ref.update(object);
}

exports.record_event = function(id, type, status) {
    var ref = db.ref("status");
	if (type === 'light'){
		if (status == 1) {status = true}else {status = false}
	} else if (type === 'dim'){
	}
	var object = {};
	object[id] = status;
	ref.child(id).once("value", (snapshot) =>{
		
		let rtime = 0 - new Date().getTime();
		
		
		  if (snapshot.val() !== status) {
			eventsref.push({id:id, 
				status: status, 
				time: admin.database.ServerValue.TIMESTAMP,
			    reverseTime: rtime});
		  }
		  ref.update(object);
	});
}
