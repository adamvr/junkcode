express = require("express");
sys = require("sys");
inspect = require("util").inspect;
events = require("events");

function createApi(handler) {
    var api = express.createServer();

    api.get('/experiment/:id', api.lambda);
    api.get('/experiment', api.lambada);

    api.setHandler = function(handler) {
	api.handler = handler;
	api.lambda = function(req, res) {
	    api.handler.on('done', function(result) {
		res.send(result);
	    });

	    api.emit('newThing', req.header('host')); 
	}
    }
	
    if(handler) {
	api.setHandler(handler);
    }
	

    return api;
}

function ExpHandler(api) {
}

sys.inherits(ExpHandler, events.EventEmitter);

ExpHandler.prototype.doX = function(arg) {
    this.emit('done', arg);
}

ExpHandler.prototype.setApi = function(api) {
    handler.api = api
    handler.api.on('newThing', function(arg) {
	handler.doX(arg);
    });
}


function createHandler(api) {
    var handler = new ExpHandler();

    if(api) {
	handler.setApi(api);
    }

    return handler;
}

handler = createHandler();
api = createApi(handler);
handler.setApi(api);

handler.on('done', function(arg) {
    console.log('Done event: ' + arg);
});

api.on('newThing', function(arg) {
    console.log('newThing event: ' + arg);
});

api.listen(3000);

