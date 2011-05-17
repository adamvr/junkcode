var express = require('express');
var app = express.createServer();


function isJson(req, res, next) {
    if(req.is('application/json')) {
	next();
    } else {
	next(new Error('Invalid request type'));
    }
}

function hasBodyParam(param) {
    return function(req,res,next) {
	if(req.body === undefined || req.body[param] === undefined) {
	    next(new Error('No ' + param + ' parameter specified'));
	} else {
	    next();
	}
    }
}

app.use(express.bodyParser(), isJson);

app.post('/', hasBodyParam('param'), function(req, res, next) {
    res.send({good: true});
});

app.listen(3000);

