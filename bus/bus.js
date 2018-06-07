var app = require('http');
var xl_tham_so = require('querystring');

var port = 3001;
var fs = require('fs');

var xmlcache = ''

var sessiontest = 'abcdef';

app.createServer((req, res) => {
	switch (req.method) {
		case 'POST':
			{
				switch(req.url) {
					case '/login':
					{
						console.log("User: " + req.headers['username']);
						console.log("Pass: " + req.headers['password']);
						var object = {
							'session':sessiontest,
							'isadmin':false
						}
						res.writeHead(200,{'Content-Type':'text/plain'});
						res.end(JSON.stringify(object));
						// res.writeHead(404, {'Content-Type':'text/plain'});
						// res.end();
					}
					break;
					case '/checksession':
					{
						// Goi dal lay session kiem tra
						// res.writeHead(404, {'Content-Type':'text/plain'});
						// res.end('Lỗi chứng thực');
						var object = {
							'session':sessiontest,
							'isadmin':false
						}
						res.writeHead(200,{'Content-Type':'text/plain'});
						res.end(JSON.stringify(object));
					}
					break;
					default:
					{
						res.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'});
						res.end('Không hỗ trợ giao thức');
					}
					break;
				}
			}
			break;
		case 'GET':
			{
				switch (req.url) {
					case '/DanhSachSanPham':
						{
							if (xmlcache === '') {
								var options = {
									hostname: 'localhost',
									port: 3000,
									path: '/DanhSachSanPham',
									method: 'GET'
								}

								var httpRes;
								httpRes = app.get(options, (response) => {
									var body = ''

									response.on('data', (chunk) => {
										body += chunk;
									}).on('end', () => {
										res.writeHeader(200, {
											'Content-Type': 'text/xml',
											'Access-Control-Allow-Origin': '*'
										})
										xmlcache = body;
										res.end(body);
										return;
									});
								});

								httpRes.on('error', function () {
									console.log("ERROR: Loi lay danh sach sp");
									res.writeHeader(404, {
										'Content-Type': 'text/plain'
									});
									res.end("Can not get data");
								});
							} else {
								res.writeHead(200, {
									'Content-Type': 'text/xml',
									'Access-Control-Allow-Origin': '*'
								})
								res.end(xmlcache);
							}
						}
						break;
					default:
						{
							res.writeHeader(404, {
								'Content-Type': 'text/plain'
							});
							res.end("Request was not support!!!");
						}
						break;
				}
			}
			break;
		default:
			{
				res.writeHeader(404, {
					'Content-Type': 'text/plain'
				});
				res.end("Request was not support!!!");
			}
			break;
	}

}).listen(port, (err) => {
	if (err != null)
		console.log("ERROR: " + err);
	else
		console.log("ServerBus is starting at port " + port);
})