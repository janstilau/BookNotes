const http = require('http')
http.createServer(function(request, response){
    console.log(request)
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('I am building a Node Http Server!');
}).listen(8880);