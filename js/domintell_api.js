var PORT = 17481;
var HOST = '192.168.1.200';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
exports.client = client;
var firebase = require('./firebase');
// import {firebase} from './firebase';

var send = function(messageString) {
    var message = new Buffer(messageString);
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
		console.log('Domintell command sent: ' + messageString);
	});
}

exports.login = () => send('LOGIN');
exports.login();

exports.logout =  () => {send('LOGOUT');}

exports.appinfo = function () { send('APPINFO');}

exports.lights =  id => send('BIR  ' + id);

exports.dim =  (id, perc) => send('DIM  ' + id+'%D'+perc);

exports.screens = (id) =>  send('TRV  ' + id);


exports.allOff =  (id) => send('MEM000006%O' );

exports.ping = (id)=> send('PING');


client.on('message', (msg, rinfo) => {
    toParse =  msg.toString();
    console.log('toParse ' +toParse)

    if (toParse.indexOf('INFO:Session timeout:INFO') !== -1) {
		console.log('time-out detected');
		exports.login();
	} 	else    if (toParse.indexOf(']')!= -1){

        if (toParse.indexOf('BIR') == 0 || toParse.indexOf('DIM') == 0) {
            dommodule = toParse.substr(0,3);
            id = toParse.substr(4,7).trim();
            desc = toParse.substr(11);
            desc = desc.substr(0, desc.indexOf('['));
            console.log(id+'###'+desc);
            if (desc.trim()!==''){
                firebase.record_module_description(id, desc, dommodule);
            }
            
        } else if (toParse.indexOf('I20') == 0|| toParse.indexOf('IS8') == 0|| toParse.indexOf('IS4') == 0) {
            dommodule = toParse.substr(0,3);
            id = toParse.substr(4,7).trim();
            desc = toParse.substr(11);
            desc = desc.substr(0, desc.indexOf('['));
            if (desc.trim()!==''){
                firebase.record_module_description(id, desc, dommodule);
            }
        } else {
            console.log('APPINFO TODO '+toParse);
        }
        
    } else

    if (toParse.indexOf('BIR')==0) {
        console.log('check ' +toParse)
        id = toParse.substr(5,4);
        
        status = toParse.substr(10,2);
        bitString = (parseInt("0x0"+status)>>>0).toString(2);
        while (bitString.length !=8){
            bitString = '0'+bitString;
        }
        for (i = 1;i <=8; i++){
            //console.log(id+'-'+i+' '+bitString+ ' ' +(8-i)+' '+bitString.charAt(8-i))
            firebase.record_event(id+'-'+i, 'light', bitString.charAt(8-i));
        }
        
    } else if (toParse.indexOf('DIM')==0) {
        dim = toParse.substr(4).trim();
        
        id = dim.substr(0,4);
        console.log('id '+id);
        for (i=5; i<21;i=i+2){
            index = ((i - 5)/2) +1;
            
            firebase.record_event(id+'-'+index, 'dim', parseInt(dim.substr(i,2).trim(), 16));
        }
        
    } else {
//         toParse =  msg.toString();
//         if (toParse.indexOf('||]')){
        console.log('PING todo' +toParse);
//         }
        
    }
	//firebase.dom_event(msg);
});