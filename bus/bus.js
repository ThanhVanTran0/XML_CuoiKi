var app = require('http');
var xl_tham_so = require('querystring');
var resErrorPage = require('../apps/modules/resErrorPage.js')

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
						// var object = {
						// 	'session':sessiontest,
						// 	'isadmin':false
						// }
						// res.end(JSON.stringify(object));

						//Gửi username và pass cho dal kiểm tra
						var options = {
							hostname: 'localhost',
							port: 3000,
							path: '/login',
							method: 'POST',
							headers: {
								"username": req.headers['username'],
								"password": req.headers['password']
							}
						}

						var httpRes =  app.get(options,function(response) {
							var body =''
							response.on('data',(chunk) => {
								body+= chunk;
							})

							response.on('end',() => {
								if(response.statusCode == 404) {
									res.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'})
									res.end(body);
								}else {
									res.writeHead(200,{'Content-Type':'text/plain'})
									res.end(body);
								}
							})
						})

						httpRes.end();
						httpRes.on('error',()=> {
							res.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'})
							res.end('Lỗi kết nối server');
						})

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
									resErrorPage(res,"Không thể kết nối đến dal")
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
							resErrorPage(res,'Không hỗ trợ đường dẫn.');
						}
						break;
				}
			}
			break;
		default:
			{
				resErrorPage(res,'Không hỗ trợ đường dẫn.');
			}
			break;
	}

}).listen(port, (err) => {
	if (err != null)
		console.log("ERROR: " + err);
	else
		console.log("ServerBus is starting at port " + port);
})