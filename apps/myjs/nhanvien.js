var duongDan = 'images/';

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function getData() {
    var xhttp = new XMLHttpRequest();
    var query = 'http://localhost:3001/DanhSachSanPham';
    xhttp.open('GET', query, false);
    xhttp.send();
    var Danh_sach_san_pham = xhttp.responseXML.getElementsByTagName('SanPham');
    return Danh_sach_san_pham;
}

function HienThiDanhSachBan(table) {
    var session = getCookie('session')
    var xhttp = new XMLHttpRequest();
    var query = '/DanhSachBan';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var Danh_sach_ban = xhttp.responseXML;
            if (Danh_sach_ban != null) {
                var HoTen = Danh_sach_ban.childNodes[0].getAttribute('HoTen')
                var SDT = Danh_sach_ban.childNodes[0].getAttribute('DienThoai')
                var DiaChi = Danh_sach_ban.childNodes[0].getAttribute('DiaChi')
                var today = getDate();
                $('#HOTEN').val(HoTen)
                $('#SDT').val(SDT)
                $('#DIACHI').val(DiaChi)
                $('#NGAY_BAN').val(today)

                table.clear().draw();
                var ds_phieu_ban = Danh_sach_ban.getElementsByTagName('PhieuBanHang');
                var length = ds_phieu_ban.length
                var TongTien = 0;
                for (var i = 0; i < length; i++) {
                    var NgayBan = ds_phieu_ban[i].getAttribute('Ngay');
                    TongTien += parseInt(ds_phieu_ban[i].getAttribute('TongTien'));
                    var ds_sp = ds_phieu_ban[i].getElementsByTagName('SanPham');
                    var length2 = ds_sp.length
                    for (var j = 0; j < length2; j++) {
                        var MaSP = ds_sp[j].getAttribute('MaSP')
                        var Ten = ds_sp[j].getAttribute('Ten')
                        var SoLuong = parseInt(ds_sp[j].getAttribute('SoLuong'));
                        var DonGia = parseInt(ds_sp[j].getAttribute('GiaBan'));
                        var TongTienPhaiTra = SoLuong * DonGia;
                        var newRow = `<tr>
                                            <td>${MaSP}</td>
                                            <td>${Ten}</td>
                                            <td>${SoLuong}</td>
                                            <td>${DonGia.toLocaleString()} VND</td>
                                            <td>${NgayBan}</td>
                                            <td>${TongTienPhaiTra.toLocaleString()}</td>
                                        </tr>`
                        table.row.add($(newRow))
                    }
                }
                table.draw();
                $('#DS_DA_BAN_TONG_TIEN').text(TongTien.toLocaleString());
            }
        }
    };
    xhttp.open('GET', query, true);
    xhttp.setRequestHeader('session', session);
    xhttp.send();
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
                        <td>${parseInt(GiaBan).toLocaleString()}</td>
                    </tr>`;
            table.row.add($(newRow));
        }
    }
    table.draw();
}

function LayGiaBan() {
    var length = g_data.length
    if (typeof length === 'undefined' || length === 0) {
        alert('Danh sách rỗng')
    } else {
        var MA_SP = $('#MA_SP').val();
        if (MA_SP === "") {
            alert('Không được để trống Mã SP')
        } else {
            for (var i = 0; i < length; i++) {
                var ma_sp = g_data[i].getAttribute('MaSP');
                ma_sp = ma_sp.toUpperCase();
                MA_SP = MA_SP.toUpperCase();
                if (MA_SP === ma_sp) {
                    $('#GIA_BAN').val(g_data[i].getAttribute('GiaBan'))
                    return;
                }
            }
            alert('Mã SP không có, vui lòng kiểm tra lại');
        }
    }
}

function TinhTien() {
    var MA_SP = $('#MA_SP').val();
    if (MA_SP === "") {
        alert('Không được để trống Mã SP')
    } else {
        var SO_LUONG = $('#SO_LUONG').val()
        if (SO_LUONG == "" || parseInt(SO_LUONG) <= 0 || isNaN(parseInt(SO_LUONG))) {
            alert('Số lượng không được bỏ trống, là số nguyên lớn hơn 0');
        } else {
            // TOdo
        }
    }
    var NGAYBAN = $('#NGAYBAN').val();

}