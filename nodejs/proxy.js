http = require("http");
sys = require("sys");

var twitterApi = "http://api.twitter.com/1"

function serve(request, response) {
    var ip = request.connection.remoteAddress;
    // var host = request.headers['host'].split(':');
    // Connect to host[0] on port host[1] or port 80 if host[1] is undefined
    var proxy = http.createClient(80, twitterApi);
    sys.log("Connecting to " + twitterApi + ":" + 80);
    var proxy_request = proxy.request(request.method, twitterApi, request.headers);
    proxy_request.addListener('response', function(proxy_response) {
	proxy_response.addListener('data', function(chunk) {
	    sys.log("Write to client: " + chunk);
	    response.write(chunk, 'binary');
	});

	proxy_response.addListener('end', function() {
	    sys.log("Closing proxy connection");
	    response.end();
	});
	response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    request.addListener('data', function(chunk) {
	proxy_request.write(chunk, 'binary');
	sys.log("Write to server: " + chunk);
    });

    request.addListener('end', function() {
	sys.log("Closing client connection");
	proxy_request.end();
	proxy_request.close();
    });
  
    sys.log("Client connected: " + ip + " " + request.method + " " + request.url);

}

http.createServer(serve).listen(3000);
