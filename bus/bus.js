var app = require('http');
var xl_tham_so = require('querystring');

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
			if(req.url === '/login') {
				
				var body = ''
				req.on('data', function (data) {
					body += data;
				}).on('end',function() {
					var post = xl_tham_so.parse(body);
					console.log(post.formID);
					console.log(post.formPass);
				})
			}
		}
		break;
		case 'GET':
		{
			switch(req.url) {
				case '/DanhSachSanPham':
				{
					var options = {
						hostname: 'localhost',
						port : 3000,
						path : '/DanhSachSanPham',
						method : 'GET'
					}

					var httpRes;
					httpRes = app.get(options, (response) => {
						var body = ''

						response.on('error',() => {
							console.log('ERROR: Lỗi lấy danh sách sản phẩm');
							res.writeHeader(404,{'Content-Type':'text/plain'});
							res.end("Can not get data");
						})

						response.on('data',(chunk) => {
							body += chunk;
						}).on('end',() => {
							res.writeHeader(200,{'Content-Type':'text/xml','Access-Control-Allow-Origin' : '*'})
							res.end(body);
							return;
						});
					});

					httpRes.on('error', function() {
							res.writeHeader(404,{'Content-Type':'text/plain'});
							res.end("Can not get data");
					});
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