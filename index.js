var fs = require('fs');
var http = require('http');
var formidable = require('formidable');
var util = require('util');
var path = require("path");
var httpProxy = require('http-proxy');

// configuration
const root = "/doc";
const rootDir = "../hexo-theme-doc-site/source/"

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
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, { 'content-type': 'text/plain' });
            res.write('received upload:\n\n');
            // TODO: replace space to -
            var file = path.join(path.resolve(__dirname, rootDir), req.url.replace(root, ""), fields["path"], fields["title"] + ".md");
            fs.writeFile(file, fields["content"], {
                "encoding": "utf8"
            }, function (err) {
                if (err) console.log(err);
                res.end(util.inspect({ fields: fields, files: files }));
            });
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

console.log("listening on port 8080")
server.listen(8080);