var app = require('http');
var xl_tham_so = require('querystring');
var resErrorPage = require('../apps/modules/resErrorPage.js')

var port = 3001;
var fs = require('fs');

var dsSession = []

var idCache = ''

function ktSession(session) {
	var length = dsSession.length
	for (var i = 0; i < length; i++) {
		if (session === dsSession[i].session) {
			return i;
		}
	}
	return -1;
}

function deleteSession(session) {
	var length = dsSession.length;
	if (length == 1 && dsSession[0].session === session) {
		dsSession.pop();
	} else {
		var index = -1;
		length = dsSession.length;
		for (var i = 0; i < length; i++) {
			if (session === dsSession[i].session) {
				index = i;
				break;
			}
		}
		if (index != -1) {
			dsSession[index] = dsSession[length - 1]
			dsSession.pop();
		}
	}
}

app.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type');
	res.setHeader('Access-Control-Allow-Headers', 'X-Signature');
	res.setHeader('Access-Control-Allow-Headers', 'X-Key');
	switch (req.method) {
		case 'POST':
			{
				switch (req.url) {
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

							var httpRes = app.get(options, function (response) {
								var body = ''
								response.on('data', (chunk) => {
									body += chunk;
								})

								response.on('end', () => {
									if (response.statusCode == 404) {
										res.writeHead(404, {
											'Content-Type': 'text/plain;charset=utf-8'
										})
										res.end(body);
									} else {
										res.writeHead(200, {
											'Content-Type': 'text/plain'
										})
										var data = JSON.parse(body);
										var object = {
											'session': data.session,
											'isadmin': data.isadmin
										}
										dsSession.push(data);
										idCache = req.headers['username']
										res.end(body);
									}
								})
							})

							httpRes.end();
							httpRes.on('error', () => {
								res.writeHead(404, {
									'Content-Type': 'text/plain;charset=utf-8'
								})
								res.end('Lỗi kết nối server');
							})

						}
						break;
					case '/checksession':
						{
							console.log("lengthss2: " + dsSession.length);
							var vitri = ktSession(req.headers['session']);
							if (vitri != -1) {
								res.writeHead(200, {
									'Content-Type': 'text/plain'
								});
								res.end(JSON.stringify(dsSession[vitri]));
							} else {
								console.log('Lỗi session không trùng khớp.')
								res.writeHead(404, {
									'Content-Type': 'text/plain'
								});
								res.end('Vui lòng logout và đăng nhập lại');
							}
						}
						break;
					case '/logout':
						{
							deleteSession(req.headers['session']);
							console.log('Sau ki del: ' + dsSession.length)
							res.writeHead(200, {
								'Content-Type': 'text/plain'
							});
							idCache = ''
							res.end("OK");
						}
						break;
					case '/TinhTien':
						{

						}
						break;
					case '/CapNhat':
						{
							// Kiem tra session truowc
							var body = ''

							req.on('data',function(chunk){
								body += chunk;
							})

							req.on('end',function() {
								// todo
							})
						}
						break;
					default:
						{
							resErrorPage(res, "Không hỗ trợ giao thức")
						}
						break;
				}
			}
			break;
		case 'GET':
			{
				console.log(req.url)
				switch (req.url) {
					case '/DanhSachSanPham':
						{
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
									res.end(body);
									return;
								});
							});

							httpRes.on('error', function () {
								console.log("ERROR: Loi lay danh sach sp");
								resErrorPage(res, "Không thể kết nối đến dal")
							});

						}
						break;
					case '/DanhSachBan':
						{
							console.log(req.headers['session'])
							var body = ''

							req.on('data', function (chunk) {
								body += chunk;
							})

							req.on('end', function () {
								console.log('Body: ' + body)
							})

							res.writeHeader(200, {
								'Content-Type': 'text/xml',
								'Access-Control-Allow-Origin': '*'
							})
							res.end('asadasd');

							// var session = req.headers['session']
							// console.log('test get session: ' + session);
							// var index = ktSession(session);
							// if (index != -1) {
							// 	var options = {
							// 		hostname: 'localhost',
							// 		port: 3000,
							// 		path: '/DanhSachBan',
							// 		headers: {
							// 			filename: idCache
							// 		},
							// 		method: 'GET'
							// 	}

							// 	var httpRes = app.get(options, function (response) {
							// 		var body = ''
							// 		response.on('data', (chunk) => {
							// 			body += chunk;
							// 		}).on('end', () => {
							// 			if (response.statusCode === 404) {
							// 				res.writeHead(404,{'Content-Type':'text/plain'})
							// 				res.end('Không thể lấy dữ liệu');
							// 			} else {
							// 				res.writeHeader(200, {
							// 					'Content-Type': 'text/xml',
							// 					'Access-Control-Allow-Origin': '*'
							// 				})
							// 				res.end(body);
							// 			}
							// 		});

							// 	})
							// 	httpRes.end();

							// 	httpRes.on('error', function () {
							// 		res.writeHead(404, {
							// 			'Content-Type': 'text/plain;charset=utf-8'
							// 		});
							// 		res.end('Máy chủ không phản hồi')
							// 	})
							// } else {
							// 	res.writeHead(404, {
							// 		'Content-Type': 'text/plain;charset=utf-8'
							// 	})
							// 	res.end('Vui lòng đăng nhập lại');
							// }
						}
						break;
					default:
						{
							resErrorPage(res, 'Không hỗ trợ đường dẫn.');
						}
						break;
				}
			}
			break;
		default:
			{
				resErrorPage(res, 'Không hỗ trợ đường dẫn.');
			}
			break;
	}

}).listen(port, (err) => {
	if (err != null)
		console.log("ERROR: " + err);
	else
		console.log("ServerBus is starting at port " + port);
})