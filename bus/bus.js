var app = require('http');

var port = 3001;
var fs = require('fs');

var options = {
	host: 'localhost',
	port: 3000,
	path: '/gettest',
	method: 'GET',
	header: {
		'Content-Type':'text/plain'
	}
}

app.createServer((req,res) => {
	switch(req.method) {
		case 'POST':
		{
			
		}
		break;
		case 'GET':
		{
			switch(req.url) {
				case '/test':
				{
					res.writeHeader(200,{'Content-Type':'text/plain','Access-Control-Allow-Origin' : '*'})
					res.end('hello');
				}
				break;
				default:
				{
					res.writeHeader(404,{'Content-Type':'text/plain'});
					res.end("Request was not support!!!");
				}
				break;
			}
		}
		break;
		default:
		{
			res.writeHeader(404,{'Content-Type':'text/plain'});
			res.end("Request was not support!!!");
		}
		break;
	}

}).listen(port,(err) => {
	if(err != null)
		console.log("ERROR: " + err);
	else
		console.log("ServerBus is starting at port " + port);
})