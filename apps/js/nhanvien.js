var duongDan = 'images/';

function getData() {
    var xhttp = new XMLHttpRequest();
    var query = 'http://localhost:3001/DanhSachSanPham';
    xhttp.open('GET', query, false);
    xhttp.send();
    var Danh_sach_san_pham = xhttp.responseXML.getElementsByTagName('SanPham');
    return Danh_sach_san_pham;
}

function HienThiDanhSachSanPham(Danh_sach_san_pham, table) {
    var length = Danh_sach_san_pham.length;
    table.clear().draw();
    for (var i = 0; i < length; i++) {
        var MASP = Danh_sach_san_pham[i].getAttribute('MaSP');
        var Ten = Danh_sach_san_pham[i].getAttribute('Ten');
        var GiaBan = Danh_sach_san_pham[i].getAttribute('GiaBan');
        var TamNgung = Danh_sach_san_pham[i].getAttribute('TamNgung');
        var img_src = duongDan + MASP + '.jpg';
        
        // Chỉ hiển thị danh sách các sản phẩm đang bán
        if (TamNgung == "false") {
            var newRow = `<tr>
                        <td>
                            <div class="sanpham_info">
                                <img src="${img_src}" alt="" width="60px" height="60px">
                            </div>
                        </td>
                        <td>${MASP}</td>
                        <td>${Ten}</td>
                        <td>${GiaBan}</td>
                    </tr>`;
            table.row.add($(newRow));
        }
    }
    table.draw();
}