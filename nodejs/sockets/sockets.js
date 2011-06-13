var util = require('util'),
    events = require('events'),
    time = require('time');


function Experiment(params) {
    var exp = this;
    events.EventEmitter.call(exp);
    exp.params = params;
    exp.created = new Date();
    exp.finished = undefined;
    exp.state = 0;

    exp.on('done', function() {
	exp.finish();
    });
}

util.inherits(Experiment, events.EventEmitter);

Experiment.prototype.run = function() {
    var exp = this;
    exp.state++;
    setTimeout(function() {
	exp.tod = new Date();
	exp.emit('done');
    }, exp.params.delay);
};

Experiment.prototype.finish = function() {
    var exp = this;
    exp.state++;
    exp.finished = new Date();
    exp.emit('finished');
};

Experiment.prototype.sanitise = function() {
    var expTemplate = {params:'', created:'', finished:'', tod:''};
    var sanitised = {};

    for(var k in this) {
	if(k in expTemplate) {
	    sanitised[k] = this[k];
	}
    }

    return sanitised;
};


var e = new Experiment({delay:1000});

e.run();

e.on('finished', function() {
    util.log(JSON.stringify(e.sanitise()));
    e.run();
});
