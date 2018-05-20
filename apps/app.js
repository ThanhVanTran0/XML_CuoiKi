var app = require('http');
var fs= require('fs');
var xl_tham_so = require('querystring');
var url = require('url');

var port = 3002;

function getFile(filePath) {
	var data = fs.readFileSync(filePath,'utf-8');
	return data;
}

app.createServer((req,res) => {
	switch(req.method) {
		case 'POST':
		{
			var body = ''

			req.on('data',function(data) {
				body += data;
			}).on('end',function() {
				var post = xl_tham_so.parse(body);
				console.log('body: ' + body);
				console.log(post.formID);
				console.log(post.formPass);
			})

			res.writeHeader(200,{'Content-type':'text/plain'})
			res.end();
		}
		break;
		case 'GET':
		{
			var path = req.url.split('?')[0];

			var req_url = (path == '/') ? '/index.html' : path;

    		var file_extension = req_url.lastIndexOf('.');
    		var duoiFile = req_url.substr(file_extension);

   			var header_type = (file_extension == -1 && req.url != '/')
                    ? 'text/plain'
                    : {
                        '/' : 'text/html',
                        '.html' : 'text/html',
                        '.ico' : 'image/x-icon',
                        '.jpg' : 'image/jpeg',
                        '.png' : 'image/png',
                        '.gif' : 'image/gif',
                        '.css' : 'text/css',
                        '.js' : 'text/javascript',
                        '.ttf' : 'font/ttf',
                        '.woff' : 'font/woff',
                        '.woff2' : 'font/woff2',
                        '.map' : 'text/plain'
                        }[duoiFile];

		    // Đọc file theo req gửi từ Client lên
		    fs.readFile( __dirname + req_url, (err, data)=>{
		        if (err) {
		            // Xử lý phần tìm không thấy resource ở Server
		            console.log('==> Error: ' + err)
		            console.log('==> Error 404: file not found ' + res.url)
		            
		            // Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client)
		            res.writeHead(404, 'Not found')
		            res.end()
		        } else {
		            // Set Header cho res
		            res.setHeader('Content-type' , header_type);
		            res.end(data);
		        }
		    })
		}
		break;
		default:
		{
			res.writeHeader(404,{'Content-Type':'text/plain'});
			res.end("Request was not support!!!");
		}
		break;
	}

}).listen(port, (err) => {
	if(err) {
		console.log("ERROR: " + err);
	}
	else {
		console.log("Server is starting at port: " + port);
	}
});