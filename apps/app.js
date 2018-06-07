var app = require('http');
var fs = require('fs');
var xl_tham_so = require('querystring');
var url = require('url');

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
				if (req.url === '/login') {
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
									res.writeHead(404, {
										'Content-Type': 'text/plain'
									});
									res.end('Không thể đăng nhập');
								} else {
									var data = JSON.parse(body);
									console.log('session: ' + data.session);
									res.writeHead(200, {
										'Set-Cookie': `session=${data.session}`,
										'Content-Type': 'text/plain',
									})
									res.end();
								}
								return;
							})
						});

						httpRes.end();

						// Trường hợp lỗi
						httpRes.on('error', function () {
							res.writeHeader(404, {
								'Content-Type': 'text/plain'
							})
							res.end('Lỗi đăng nhập');
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
				console.log('req_url: '+ req_url)

				var cookie = parseCookies(req);
				var session = cookie['session'];

				//Check session dang nhap
				if (req_url === '/admin.html' || req_url === '/NhanVien.html') {
					if (typeof session === 'undefined') {
						res.writeHead(302, {
							'Content-Type': 'text/html',
							'Location': '/DangNhap.html'
						})
						res.end();
						return;
					} else {
						console.log('Vo kiem tra session')
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
									res.writeHead(404, {
										'Content-Type': 'text/plain;charset=utf-8'
									});
									res.end('Lỗi, vui lòng logout và đăng nhập lại');
									res.destroy();
								} else {
									var data = JSON.parse(body);
									console.log('session: ' + data.session);
									var location = '/NhanVien.html'
									if (data.isadmin == true) {
										location = '/admin.html'
									}
									console.log('Location: ' + location)
								}
							});
							
						});

						httpRes.end();
						httpRes.on('error', (err) => {
							res.writeHead(404, {
								'Content-Type': 'text/plain;charset=utf-8'
							})
							res.end('Lỗi chứng thực, vui lòng logout và đăng nhập lại');
							return;
						})
					}
				}

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
						res.writeHead(404, 'Not found')
						res.end()
					} else {
						// Set Header cho res
						res.setHeader('Content-type', header_type);
						res.end(data);
					}
				})
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