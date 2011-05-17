ExperimentState = {"Unqueued": -1, "Queued" : 0, "Running" : 1, "Completed" : 2, "Cancelled" : 3};
experiments = [];
queue = [];

tick = 0;

function Experiment(params, queue) {
    this.params = params;
    this.params = params;
    this.created = new Date();
    this.startedTime = undefined;
    this.state = ExperimentState.Unqueued;
    this.result = undefined;
    this.estimatedCompletionTime = 1000;
}

function addExperiment(parameters) {
    console.log("Adding experiment");
    experiment = new Experiment(parameters, queue);
    experiments.push(experiment);

    return experiments.length - 1;
}

function removeExperimentFromQueue(exp) {
    for(var i = 0; i < queue.length; i++) {
	if(exp === queue[i]) {
	    break;
	}
    }

    if(i == queue.length - 1) {
	queue[i] = undefined;
	return true;
    }

    if(i >= queue.length) {
	return false;
    }

    for(; i < queue.length; i++) {
	queue[i] = queue[i+1];
    }

    return true;
}

addExperiment("a");
addExperiment("b");
addExperiment("c");
everyTick();

function everyTick() {
    /*
    for(var i = 0; i < experiments.length; i++) {
	console.log(i + JSON.stringify(experiments[i]));
    }
    */
    for(var i = 0; i < experiments.length; i++) {
	var exp = experiments[i];
	if(exp === undefined) {
	    break;
	}
	switch(exp.state) {
	    case ExperimentState.Unqueued:
		queue.push(exp);
		exp.state = ExperimentState.Queued;
		break;
	    case ExperimentState.Queued:
		if(exp === queue[0]) {
		    exp.state = ExperimentState.Running;
		    exp.startedTime = new Date();
		}
		break;
	    case ExperimentState.Running:
		var currentTime = new Date();
		console.log("Time started: " + exp.startedTime + " Current time: " + currentTime);
		console.log(currentTime - exp.startedTime);
		if(currentTime.getTime() - exp.startedTime.getTime() >= exp.estimatedCompletionTime) {
		    exp.state = ExperimentState.Completed;
		    removeExperimentFromQueue(exp);
		}
		break;
	    default:
		/* State what we'll never reach
		 */
		console.log("Invalid state");
	}
    }
    process.nextTick(everyTick);
}
