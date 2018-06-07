var app = require('http');
var fs = require('fs');
var xl_tham_so = require('querystring');
var url = require('url');
var resErrorPage = require('./modules/resErrorPage');

var port = 3002;

function parseCookies(request) {
	var list = {},
		rc = request.headers.cookie;

	rc && rc.split(';').forEach(function (cookie) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});

	return list;
}

app.createServer((req, res) => {
	switch (req.method) {
		case 'POST':
			{
				if (req.url === '/DangNhap.html') {
					var body = ''

					req.on('data', function (data) {
						body += data;
					}).on('end', function () {
						var post = xl_tham_so.parse(body);

						var options = {
							hostname: 'localhost',
							port: 3001,
							path: '/login',
							method: 'POST',
							headers: {
								"username": post.formID,
								"password": post.formPass
							}
						}

						var httpRes;
						httpRes = app.get(options, (response) => {
							var body = ''
							response.on('data', (chunk) => {
								body += chunk;
							})

							response.on('end', () => {
								if (response.statusCode == 404) {
									resErrorPage(res, 'Không thể đăng nhập');
								} else {
									var data = JSON.parse(body);
									console.log('session: ' + data.session);
									res.writeHead(200, {
										'Set-Cookie': `session=${data.session}`,
										'Content-Type': 'text/plain',
									})
									if (data.isadmin == false) {
										res.end("/NhanVien.html");
									} else {
										res.end('/admin.html');
									}
								}
								return;
							})
						});

						httpRes.end();

						// Trường hợp lỗi
						httpRes.on('error', function () {
							resErrorPage(res, 'Không thể kết nối đến server.');
						});
					})

				} else {
					res.writeHead(404, {
						'Content-Type': 'text/plain'
					})
					res.end('Error');
				}
			}
			break;
		case 'GET':
			{
				var path = req.url.split('?')[0];

				var req_url = (path == '/') ? '/index.html' : path;

				if (req_url === '/admin.html' || req_url === '/NhanVien.html') {
					var cookie = parseCookies(req);
					var session = cookie['session'];

					//Check session dang nhap
					if (typeof session === 'undefined') {
						res.writeHead(302, {
							'Content-Type': 'text/html',
							'Location': '/DangNhap.html'
						})
						res.end();
						return;
					} else {
						//Gửi bus để kiểm tra session
						var options = {
							hostname: 'localhost',
							port: 3001,
							method: "POST",
							path: '/checksession',
							headers: {
								session: cookie['session']
							}
						}

						var httpRes;
						httpRes = app.get(options, (response) => {
							var body = ''
							response.on('data', (chunk) => {
								body += chunk;
							})

							response.on('end', () => {
								if (response.statusCode == 404) {
									resErrorPage(res, body)
								} else {
									var data = JSON.parse(body);
									console.log('body: ' + body);
									if (data.isadmin === false && req_url === '/admin.html') {
										resErrorPage(res, 'Tài khoản của bạn không được quyền truy cập trang này.');
									} else {
										// Trả về file html
										// Đọc file theo req gửi từ Client lên
										fs.readFile(__dirname + req_url, (err, data) => {
											if (err) {
												// Xử lý phần tìm không thấy resource ở Server
												console.log('==> Error: ' + err)
												console.log('==> Error 404: file not found ' + res.url)

												// Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client)
												resErrorPage(res, "");
											} else {
												// Set Header cho res
												res.setHeader('Content-type', 'text/html');
												res.end(data);
											}
										})
									}
								}
							});

						});

						httpRes.end();
						httpRes.on('error', (err) => {
							res.writeHead(404, {
								'Content-Type': 'text/plain;charset=utf-8'
							})
							res.end('Không thể kết nối đến server.');
							return;
						})
					}
				} else {
					var file_extension = req_url.lastIndexOf('.');
					var duoiFile = req_url.substr(file_extension);

					var header_type = (file_extension == -1 && req.url != '/') ?
						'text/plain' : {
							'/': 'text/html',
							'.html': 'text/html',
							'.ico': 'image/x-icon',
							'.jpg': 'image/jpeg',
							'.png': 'image/png',
							'.gif': 'image/gif',
							'.css': 'text/css',
							'.js': 'text/javascript',
							'.ttf': 'font/ttf',
							'.woff': 'font/woff',
							'.woff2': 'font/woff2',
							'.map': 'text/plain'
						}[duoiFile];

					// Đọc file theo req gửi từ Client lên
					fs.readFile(__dirname + req_url, (err, data) => {
						if (err) {
							// Xử lý phần tìm không thấy resource ở Server
							console.log('==> Error: ' + err)
							console.log('==> Error 404: file not found ' + res.url)

							// Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client)
							resErrorPage(res, "");
						} else {
							// Set Header cho res
							res.setHeader('Content-type', header_type);
							res.end(data);
						}
					})
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
	if (err) {
		console.log("ERROR: " + err);
	} else {
		console.log("Server is starting at port: " + port);
	}
});