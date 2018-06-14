var layThongTin = require('./services/laythongtin.js')
var luuDuLieu = require('./services/luuDuLieu.js')

var app = require('http');
var url = require('url');
var query = require('querystring');
var resErrorPage = require('../apps/modules/resErrorPage.js')

var port = 3000;

function ktTaiKhoan(dsTaiKhoan, user, pass) {
	var length = dsTaiKhoan.length;
	for (var i = 0; i < length; i++) {
		var id = dsTaiKhoan[i].getAttribute('id')
		var password = dsTaiKhoan[i].getAttribute('password')
		if (id === user && pass === password) {
			return i
		}
	}
	return -1
}

function createSession() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

var dsSp = ""

app.createServer((req, res) => {
	var method = req.method;
	switch (method) {
		case 'POST':
			{
				switch (req.url) {
					case '/login':
						{
							var user = req.headers['username'];
							var pass = req.headers['password'];
							console.log('user: ' + user);
							console.log('pass: ' + pass);
							var dsTaiKhoan = layThongTin.get_tai_khoan();
							if (dsTaiKhoan != null) {
								var vitri = ktTaiKhoan(dsTaiKhoan, user, pass);
								if (vitri != -1) {
									var isadmin = dsTaiKhoan[vitri].getAttribute('isadmin');
									var session = createSession();
									var object = {
										'session': `${session}`,
										'isadmin': `${isadmin}`,
										'name': `${dsTaiKhoan[vitri].getAttribute('name')}`,
										'id': dsTaiKhoan[vitri].getAttribute('id')
									}
									res.writeHead(200, {
										'Content-Type': 'text/plain'
									})
									res.end(JSON.stringify(object));
								} else {
									res.writeHead(404, {
										'Content-Type': 'text/plain;charset=utf-8'
									});
									res.end('Tài khản hoặc mật khẩu không chính xác');
								}
							}
							res.writeHead(404, {
								'Content-Type': 'text/plain;charset=utf-8'
							});
							res.end();
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
								console.log(data)
								var check = luuDuLieu.thay_Doi_San_Pham(data);
								
								if(check == true) {
									dsSp = ""
									console.log(dsSp)
									res.writeHead(200, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									});
									res.end('Thay đổi thành công.')
								}
								else {
									res.writeHead(404, {
										'Content-Type': 'text/plain',
										'Access-Control-Allow-Origin': '*'
									});
									res.end('Không thể thay đổi cập nhật')
								}
							})
						}
						break;
					default:
						resErrorPage(res, 'Không hỗ trợ đường dẫn.');
						break;
				}
			}
			break;
		case 'GET':
			{
				switch (req.url) {
					case '/DanhSachSanPham':
						{
							if (dsSp == "") {
								dsSp = layThongTin.get_ds_San_Pham();
							}
							res.writeHeader(200, {
								'Content-Type': 'text/xml',
								'Access-Control-Allow-Origin': '*'
							});
							res.end(dsSp)
						}
						break;
					case '/DanhSachBan':
						{
							var filename = req.headers['filename'];
							filename += "_Phieu_Ban.xml"
							phieuBan = layThongTin.get_danh_sach_ban(filename);

							if (phieuBan == null) {
								res.writeHead(404, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin': '*'
								})
								res.end('File lỗi')
								return;
							}
							res.writeHeader(200, {
								'Content-Type': 'text/xml',
								'Access-Control-Allow-Origin': '*'
							});
							res.end(phieuBan)
						}
						break;
					default:
						resErrorPage(res, 'Không hỗ trợ đường dẫn.');
						break;
				}
			}
			break;
		default:
			resErrorPage(res, 'Không hỗ trợ đường dẫn.');
			break;
	}

}).listen(port, (err) => {
	if (err != null)
		console.log("ERROR: " + err);
	else
		console.log("Server is starting at port " + port);
});