express = require("express");
spawn = require("child_process").spawn;

var app = express.createServer();

app.get('/topic/:param?', function(req, res){
    var topic = req.params.param;
    var msg = req.query.msg;
    res.send(topic + ' ' + msg);
    mosq = spawn('mosquitto_pub', ['-t', topic, '-m', msg]);
});

app.listen(3000);
