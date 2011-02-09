express = require("express");
spawn = require("child_process").spawn;
sys = require("sys");

var messages = []

var app = express.createServer();

sub = spawn('mosquitto_sub', ['-v', '-t', '#']);

function addMessage(topic, msg) {
    var msgObj = new Object();
    msgObj.timestamp = new Date();
    msgObj.payload = msg;
    //msgObj.topic = topic;

    if(messages[topic]) {
	messages[topic].push(msgObj);
    } else {
	messages[topic] = new Array(msgObj);
    }
}

sub.stdout.on('data', function(data) {
    var split = data.toString('ascii').split(" ", 2);

    sys.log(split);
    addMessage(split[0], split[1].slice(0,-1));

    sys.log("Messages!");
    for(k in messages) {
	sys.log("key: " + k + " value: " + JSON.stringify(messages[k]));
    }
    sys.log("No more messages!");
});

sub.on('exit', function(data) {
    sys.log("Shit's exitin");
});

app.get('/:topic', function(req, res, next){
    var topic = req.params.topic;
    if(req.query.since === undefined) {
	next();
    }
    var since = new Date(req.query.since);
    var json = new Object();

    sys.log(topic + " " + since + " requested");

    json.topic = topic;
    if(messages[topic] === undefined) {
	json.messages = [];
    } else {
	json.messages = messages[topic].reduce(function(v) {
	    sys.log(JSON.stringify(v));
	    if(v.timestamp > since) {
		sys.log("> since");
		return true;
	    } else {
		sys.log("< since");
		return false;
	    }
	});
    }

    /*
    json.messages = [];
    if(messages[topic]) {
	for(var k in messages[topic]) {
	    sys.log(messages[topic][k].timestamp + " " + messages[topic][k].payload);
	    if(messages[topic][k].timestamp > timestamp) {
		json.messages.push(messages[topic][k]);
	    }
	}
    }
    */
    sys.log(JSON.stringify(json));
    res.send(json);
});

app.get('/:topic', function(req, res) {
    var topic = req.params.topic;
    res.send({"topic":topic, "messages":messages[topic]});
});

/*
app.post('/:topic', function(req,res) {
    var topic = req.params.topic;
    var msg = JSON.stringify(req.body);

    sys.log(msg);
    sys.log("Publishing message " + msg + " to topic " + topic);
    pub = spawn('mosquitto_pub', ['-t', topic, '-m', msg]);

    res.send({"success":"true"});
});
*/

app.listen(3000);
