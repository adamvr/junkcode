var express = require("express"),
    exp = require("./exp");
    middleware = require("./middleware"),
    util = require("util");


app = express.createServer();

app.use(express.bodyParser());
app.use(express.logger());

/* API methods */
app.post('/experiment', exp.createExp);
app.get('/experiment/:id', exp.getExp);
app.get('/experiment/:id/result', exp.getResult);
app.del('/experiment/:id', exp.cancel);
app.get('/queue/length', exp.getQueueLength);

/* Serve up scripts */
app.get('/', function(req,res,next) {
    res.sendfile('./index.html');
});

app.get('/jquery', function(req,res,next) {
    res.sendfile('./jquery.js');
});

app.get('/pretty', function(req,res,next) {
    res.sendfile('./pretty.js');
});

/* Listen */
app.listen(3000);
