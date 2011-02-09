express = require("express");
spawn = require("child_process").spawn;
sys = require("sys");

var messages = []

var app = express.createServer();

sub = spawn('mosquitto_sub', ['-v', '-t', '#']);

sub.stdout.on('data', function(data) {
    var split = data.toString('ascii').split(" ", 2);

    var msgObj = new Object();
    msgObj.timestamp = new Date();
    msgObj.payload = split[1].slice(0, -1);


    if(messages[split[0]]) {
	messages[split[0]].push(msgObj);
    } else {
	messages[split[0]] = [msgObj];
    }

    sys.log("Messages!");
    for(k in messages) {
	sys.log("key: " + k + " value: " + messages[k]);
    }
    sys.log("No more messages!");
});

sub.on('exit', function(data) {
    sys.log("Shit's exitin");
});

app.get('/:topic?', function(req, res){
    var topic = req.params.topic;
    var timestamp = new Date(req.query.timestamp);
    var json = new Object();

    sys.log(topic + " " + timestamp + " requested");

    json.topic = topic;
    json.messages = [];
    if(messages[topic]) {
	for(var k in messages[topic]) {
	    sys.log(messages[topic][k].timestamp + " " + messages[topic][k].payload);
	    if(messages[topic][k].timestamp > timestamp) {
		json.messages.push(messages[topic][k]);
	    }
	}
    }

    res.send(json);
});


app.listen(3000);
