var express = require("express"),
    util = require("util");

function Api() {
    var api = this;
    express.HTTPServer.call(api);
    api.use(express.bodyParser());
    api.use(express.logger());

    api.handler = {
	createExperiment: function(desc, cb) {
	    cb(new Error("Not implemented"));
	},

	getExperiment: function(id, cb) {
	    cb(new Error("Not implemented"));
	},

	cancelExperiment: function(id, cb) {
	    cb(new Error("Not implemented"));
	},

	getResult: function(id, cb) {
	    cb(new Error("Not implemented"));
	}
    };

    api.post('/experiment', function(req, res, next) {
	api.handler.createExperiment(req.body, function(result) {
	    res.send(result);
	});
    });

    api.get('/experiment/:id', function(req, res, next) {
	api.handler.getExperiment(req.params.id, function(result) {
	    res.send(result);
	});
    });

    api.get('/experiment/:id/result', function(req, res, next) {
	api.handler.getResult(req.params.id, function(result) {
	    res.send(result);
	});
    });

    api.del('/experiment/:id', function(req, res, next) {
	api.handler.cancelExperiment(req.params.id, function(result) {
	    res.send(result);
	});
    });
}

util.inherits(Api, express.HTTPServer);

module.exports.Api = Api;
