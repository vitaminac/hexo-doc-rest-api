var http = require('http');
var httpProxy = require('http-proxy');

// configuration
const root = "/doc";

var options = {};

var proxy = httpProxy.createProxyServer(options);

function checkRESTApiRequest(res) {
    var url = res.url;
    if (res.method === "POST" && (url === root || url.startsWith(root + "/"))) {
        // TODO: security check
        return true;
    }
    return false;
}

var server = http.createServer(function (req, res) {
    if (req.method.toUpperCase() === "GET") {
        proxy.web(req, res, { target: 'http://0.0.0.0:5000/' });
    } else if (checkRESTApiRequest(req)) {
        res.writeHead(200);
        res.end("TOOD");
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

console.log("listening on port 8080")
server.listen(8080);