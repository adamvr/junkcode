http = require("http");
sys = require("sys");

function serve(request, response) {
    var ip = request.connection.remoteAddress;
    var host = request.headers['host'].split(':');
    // Connect to host[0] on port host[1] or port 80 if host[1] is undefined
    var proxy = http.createClient(host[1] || 80, host[0]);
    var proxy_request = proxy.request(request.method, request.url, request.headers);
    proxy_request.addListener('response', function(proxy_response) {
	proxy_response.addListener('data', function(chunk) {
	    response.write(chunk, 'binary');
	});

	proxy_response.addListener('end', function() {
	    response.end();
	});
	response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    request.addListener('data', function(chunk) {
	proxy_request.write(chunk, 'binary');
    });

    request.addListener('end', function() {
	proxy_request.end();
	proxy_request.close();
    });
  
    sys.log("Client connected: " + ip + " " + request.method + " " + request.url);

}

http.createServer(serve).listen(3000);
