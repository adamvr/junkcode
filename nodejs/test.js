spawn = require("child_process").spawn;
sys = require("sys");

sub = spawn('mosquitto_sub', ['-v', '-t', '#']);

sub.stdout.on('data', function(data) {
    sys.log(data.toString('ascii'));
    var split = data.toString('ascii').split(" ", 1);

    sys.log(split);

});

sub.on('exit', function(data) {
    sys.log("mosquitto_sub is exiting for some reason");
});
