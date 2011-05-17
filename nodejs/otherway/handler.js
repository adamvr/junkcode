var events = require("events"),
    util = require("util");

function Runner() {
    var running = false;
}

util.inherits(Runner, events.EventEmitter);

function Handler() {
    this.queue = [];
    this.experiments = [];
    this.results = [];
    this.runner = new Runner();
}



Runner.prototype.run = function(exp) {
    var runner = this;
    if(runner.running) {
	this.emit('error', 'already running');
	return;
    } else {
	runner.running = true;
	setTimeout(function() {
	    runner.emit('done', exp.id, exp.string);
	    runner.running = false;
	}, 10000);
	return;
    }
}


Handler.prototype.createExperiment = function(desc, cb) {
    var exp = {id: this.experiments.length, state:'fuckinqueued'};
    this.experiments.push(exp);
    this.queue.push(exp);

    if(desc.string) {
	exp.string = desc.string;
    }

    var handler = this;

    this.runner.on('done', function(id, result) {
	var res = {expid: id, result:result};
	handler.experiments[id].resultId = handler.results.length;
	handler.results.push(res);
	util.log(util.inspect(handler.experiments));
    });

    this.runner.on('error', function(err) {


    this.runner.run(exp);
    if(cb) {
	cb(exp);
    }
}

Handler.prototype.getExperiment = function(id, cb) {
    var exp = this.experiments[id];
    cb(exp ? exp : new Error("Experiment not found"));
}

Handler.prototype.getResult = function(id, cb) {
    var exp = this.experiments[id];
    if(!exp) {
	cb(new Error("Experiment not found"));
    } else {
	cb(exp.resultId !== undefined ? this.results[exp.resultId] : new Error("Unable to get result"));
    }
}

Handler.prototype.cancelExperiment = function(id, cb) {
    var exp = this.experiments[id];
    cb(exp ? true : new Error("Experiment not found"));
}

module.exports.Handler = Handler;

