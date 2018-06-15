const app = require('http');
const xl_tham_so = require('querystring');
const resErrorPage = require('../apps/modules/resErrorPage.js')

const port = 3001;
const fs = require('fs');

let dsSession = []
let dsSPCache = "";

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
	switch (req.method) {
		case 'POST':
			{
				switch (req.url) {
					case '/login':
						{
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
							res.writeHead(200, {
								'Content-Type': 'text/plain'
							});
							res.end("OK");
						}
						break;
					case '/TinhTien':
						{
							var body = ""
							req.on('data', function (chunk) {
								body += chunk
							}).on('end', function () {
								var data = JSON.parse(body);
								var session = data.session;
								var index = ktSession(session)
								if (index != -1) {
									data.id = dsSession[index].id;
									body = JSON.stringify(data);
									var options = {
										hostname: 'localhost',
										port: 3000,
										path: '/TinhTien',
										method: 'POST',
										headers: {
											'Content-Type': 'text/plain',
											'Access-Control-Allow-Origin': '*'
										}
									}

									var httpRes = app.request(options, function (response) {
										var body = ''
										response.on('data', (chunk) => {
											body += chunk;
										}).on('end', () => {
											if (response.statusCode === 404) {
												res.writeHead(404, {
													'Content-Type': 'text/plain'
												})
												res.end(body);
											} else {
												res.writeHeader(200, {
													'Content-Type': 'text/plain',
													'Access-Control-Allow-Origin': '*'
												})
												dsSession[index].dsBanHang = ""
												res.end(body);
											}
										});

									})
									httpRes.write(body);
									httpRes.end();

									httpRes.on('error', function () {
										res.writeHead(404, {
											'Content-Type': 'text/plain;charset=utf-8'
										});
										res.end('Máy chủ không phản hồi')
									})
								} else {
									res.writeHead(404, {
										'Content-Type': 'text/plain;charset=utf-8'
									})
									res.end('Vui lòng đăng nhập lại');
								}
							})
						}
						break;
					case '/CapNhat':
						{
							var body = ''

							req.on('data', function (chunk) {
								body += chunk;
							})

							req.on('end', function () {
								var data = JSON.parse(body);
								var session = data.session;
								var index = ktSession(session)
								if (index != -1) {
									var options = {
										hostname: 'localhost',
										port: 3000,
										path: '/CapNhat',
										method: 'POST',
										headers: {
											'Content-Type': 'text/plain',
											'Access-Control-Allow-Origin': '*'
										}
									}

									var httpRes = app.request(options, function (response) {
										var body = ''
										response.on('data', (chunk) => {
											body += chunk;
										}).on('end', () => {
											if (response.statusCode === 404) {
												res.writeHead(404, {
													'Content-Type': 'text/plain'
												})
												res.end(body);
											} else {
												res.writeHeader(200, {
													'Content-Type': 'text/plain',
													'Access-Control-Allow-Origin': '*'
												})
												dsSPCache = ""
												res.end(body);
											}
										});

									})
									httpRes.write(body);
									httpRes.end();

									httpRes.on('error', function () {
										res.writeHead(404, {
											'Content-Type': 'text/plain;charset=utf-8'
										});
										res.end('Máy chủ không phản hồi')
									})
								} else {
									res.writeHead(404, {
										'Content-Type': 'text/plain;charset=utf-8'
									})
									res.end('Vui lòng đăng nhập lại');
								}
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
				switch (req.url) {
					case '/DanhSachSanPham':
						{
							if (dsSPCache != "") {
								res.writeHeader(200, {
									'Content-Type': 'text/xml',
									'Access-Control-Allow-Origin': '*'
								})
								res.end(dsSPCache);
							} else {
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
										dsSPCache = body;
										res.end(body);
										return;
									});
								});

								httpRes.on('error', function () {
									console.log("ERROR: Loi lay danh sach sp");
									resErrorPage(res, "Không thể kết nối đến dal")
								});
							}
						}
						break;
					case '/DanhSachBan':
						{
							var session = req.headers['session']
							var index = ktSession(session);
							if (index != -1) {
								if (dsSession[index].dsBanHang != "") {
									res.writeHeader(200, {
										'Content-Type': 'text/xml',
										'Access-Control-Allow-Origin': '*'
									})
									res.end(dsSession[index].dsBanHang);
								} else {
									var options = {
										hostname: 'localhost',
										port: 3000,
										path: '/DanhSachBan',
										headers: {
											filename: dsSession[index].id
										},
										method: 'GET'
									}

									var httpRes = app.get(options, function (response) {
										var body = ''
										response.on('data', (chunk) => {
											body += chunk;
										}).on('end', () => {
											if (response.statusCode === 404) {
												res.writeHead(404, {
													'Content-Type': 'text/plain'
												})
												res.end('Không thể lấy dữ liệu');
											} else {
												res.writeHeader(200, {
													'Content-Type': 'text/xml',
													'Access-Control-Allow-Origin': '*'
												})
												dsSession[index].dsBanHang = body;
												res.end(body);
											}
										});

									})
									httpRes.end();

									httpRes.on('error', function () {
										res.writeHead(404, {
											'Content-Type': 'text/plain;charset=utf-8'
										});
										res.end('Máy chủ không phản hồi')
									})
								}
							} else {
								res.writeHead(404, {
									'Content-Type': 'text/plain;charset=utf-8'
								})
								res.end('Vui lòng đăng nhập lại');
							}
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