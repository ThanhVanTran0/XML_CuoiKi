var app = require('http');
var xl_tham_so = require('querystring');
var resErrorPage = require('../apps/modules/resErrorPage.js')

var port = 3001;
var fs = require('fs');

var xmlcache = ''

var dsSession = []

function ktSession(session) {
	var length = dsSession.length
	for(var i =0 ;i<length;i++) {
		if(session === dsSession[i].session) {
			return i;
		}
	}
	return -1;
}

app.createServer((req, res) => {
	switch (req.method) {
		case 'POST':
			{
				switch(req.url) {
					case '/login':
					{
						console.log("lengthss: " + dsSession.length);
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
									var data = JSON.parse(body);
									var object = {
										'session':data.session,
										'isadmin':data.isadmin
									}
									dsSession.push(data);
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
						console.log("lengthss2: " + dsSession.length);
						var vitri = ktSession(req.headers['session']);
						if(vitri!=-1) {
							res.writeHead(200,{'Content-Type':'text/plain'});
							res.end(JSON.stringify(dsSession[vitri]));
						}
						else {
							console.log('Lỗi session không trùng khớp.')
							res.writeHead(404,{'Content-Type':'text/plain'});
							res.end('Vui lòng logout và đăng nhập lại');
						}
					}
					break;
					default:
					{
						resErrorPage(res,"Không hỗ trợ giao thức")
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