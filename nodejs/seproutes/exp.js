var util = require("util"),
    events = require("events");

module.exports.createExp = function(req, res, next) {
    var id = handler.createExperiment(req.body).id;
    util.log(util.inspect(req.body));
    
    var uri = 'http://' + req.header('host') + '/experiment/' + id;
    res.send({experiment:uri});
}

module.exports.getExp = function(req, res, next) {
    var result = handler.getExperiment(req.params.id);
    res.send(result);
}

module.exports.getResult = function(req, res, next) {
    var result = handler.getResult(req.params.id);
    res.send(result);
}

module.exports.cancel = function(req, res, next) {
    res.send(400);
}

module.exports.getQueueLength = function(req, res, next) {
    res.send({queueLength:handler.queue.length});
}

function ExpHandler() {
    events.EventEmitter.call(this);
    this.exps = [];
    this.queue = [];
    this.results = [];
    this.running = undefined;

    var h = this;

    this.on('new', function(id) {
	h.queue.push(h.exps[id]);
	if(h.running === undefined) {
	    h.runExp(id);
	} 
    });

    this.on('done', function(id) {
	h.queue = h.queue.slice(1);
	if(h.queue.length > 0) {
	    h.runExp(h.queue[0].id);
	}
    });

}

util.inherits(ExpHandler, events.EventEmitter);

ExpHandler.prototype.createExperiment = function createExperiment(desc) {
    if(desc === undefined) {
	return new Error("Invalid description");
    }
    var exp = {id:this.exps.length, created:new Date()};
    for(k in desc) {
	exp[k] = desc[k];
    }

    this.exps.push(exp);
    this.emit('new', exp.id);
    return exp;
}

ExpHandler.prototype.getExperiment = function getExperiment(id) {
    if(this.exps[id] === undefined) {
	return new Error("Experiment not found");
    } else {
	return this.exps[id];
    }
}

ExpHandler.prototype.getResult = function getResult(id) {
    var res = this.getExperiment(id);
    if(res.resultId === undefined) {
	return new Error("Unable to get experiment results");
    } else {
	return this.results[res.resultId];
    }
}

ExpHandler.prototype.runExp = function runExp(id) {
    var h = this;
    var res = h.getExperiment(id);
    if(res === undefined) {
	return;
    } else {
	res.resultId = h.results.length;

	h.running = id;

	h.results.push({timeofday: new Date()});
	h.emit('done', id);
    }
}

var handler = new ExpHandler();
