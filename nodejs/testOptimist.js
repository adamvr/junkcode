var argv = require("optimist").argv;

if(argv.awesome === undefined) {
    console.log("That aint cool");
} else {
    console.log("AWESOME");
}
