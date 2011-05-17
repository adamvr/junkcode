var api = require("./api"),
    handler = require("./handler");

var app = new api.Api();
var handler = new handler.Handler();

app.handler = handler;

app.listen(3000);
