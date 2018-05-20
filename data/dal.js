var layThongTin = require("./services/layThongTin.js");

var app = require('http');
var url = require('url');
var query = require('querystring');

var port = 3000;

app.createServer((req,res) => {
	var method = req.method;
	switch(method) {
		case 'POST':
		{
		}
		break;
		case 'GET':
		{
			switch(req.url) {
				case '/DanhSachSanPham':
				{
					var xml = layThongTin.get_ds_San_Pham();
					res.writeHeader(200,{'Content-Type':'text/xml'});
					res.end(xml)
				}
				break;
				case '/gettest':
				{
					var xml = layThongTin.get_ds_San_Pham();
					res.writeHeader(200,{'Content-Type': 'text/plain'})
					res.end(xml)
				}
				break;
				default:
		        	res.writeHeader(404, {'Content-Type': 'text/plain'})
		        	res.end("Request was not support!!!")
		        break;
			}			
		}
		break;
		default:
        	res.writeHeader(404, {'Content-Type': 'text/plain'})
        	res.end("Request was not support!!!")
        break;
	}

}).listen(port, (err) => {
	if(err!=null)
		console.log("ERROR: " + err);
	else
		console.log("Server is starting at port " + port);
});
