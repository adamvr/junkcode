express = require("express");
spawn = require("child_process").spawn;
sys = require("sys");

var messages = []

var app = express.createServer();
app.use(express.bodyDecoder());

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

function publish(topic, payload, qos, retain) {
    sys.log(topic + payload + qos + retain);
    var args = [];
    if(topic) {
	args.push('-t');
	args.push(topic);
    } else {
	return false;
    }

    if(payload) {
	args.push('-m');
	args.push(payload);
    } else {
	return false;
    }

    if(retain && retain === true) {
	args.push('-r');
    }

    if(qos && (qos >= 0 && qos <= 3)) {
	args.push('-q');
	args.push(qos);
    }


    sys.log("Spawning mosquitto_pub with arguments " + args);

    sub = spawn('mosquitto_pub', args);
    return true;
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
    sys.log("mosquitto_sub is exiting for some reason");
});

app.get('/:topic', function(req, res, next){
    var topic = req.params.topic;
    /* No 'since' parameter supplied, call get all version of app.get */ 
    if(req.query.since === undefined) {
	next();
	return;
    }
    var since = new Date(req.query.since);
    var json = new Object();

    sys.log("Messages on " + topic + " since " + since + " requested");

    json.topic = topic;
    if(messages[topic] === undefined) {
	json.messages = [];
    } else {
	json.messages = messages[topic].filter(function(v) {
	    if(v.timestamp > since) {
		return true;
	    } else {
		return false;
	    }
	});
    }

    sys.log(JSON.stringify(json));
    res.send(json);
});

app.get('/:topic', function(req, res) {
    var topic = req.params.topic;
    sys.log("All messages on topic " + topic + " requested");
    /* Send the contents of messages[topic] or
     * an empty array if that's undefined */
    res.send({"topic":topic, "messages":messages[topic]||[]});
});

app.post('/:topic', function(req,res) {
    var topic = req.params.topic;
    var msg = req.body;
    var payload = msg.payload

    sys.log(JSON.stringify(msg));

    if(payload === undefined) {
	sys.log("Invalid publish request received: " + msg);
	res.send({"success":"false", "reason":"Invalid request"});
	return;
    }

    var qos = req.body.qos || 0;
    var retain = req.body.retain || false;

    sys.log(payload);
    sys.log("Publishing message " + payload + " to topic " + topic + " with qos " + qos + " retaining " + retain);
    publish(topic, payload, qos, retain);

    res.send({"success":"true"});
});

app.listen(3000);
