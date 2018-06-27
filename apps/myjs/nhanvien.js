var duongDan = 'images/';
let DS_SPBAN = [];
let g_TongTien = 0;

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
    var today = mm + '/' + dd + '/' + yyyy;
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
                    var TONG_TIEN_CUA_PHIEU = parseInt(ds_phieu_ban[i].getAttribute('TongTien'));
                    TongTien += TONG_TIEN_CUA_PHIEU;
                    var ds_sp = ds_phieu_ban[i].getElementsByTagName('SanPham');
                    var length2 = ds_sp.length
                    for (var j = 0; j < length2; j++) {
                        var MaSP = ds_sp[j].getAttribute('MaSP')
                        var Ten = ds_sp[j].getAttribute('Ten')
                        var SoLuong = parseInt(ds_sp[j].getAttribute('SoLuong'));
                        var DonGia = parseInt(ds_sp[j].getAttribute('GiaBan'));
                        var Ten_KH = ds_sp[j].getAttribute('TenKH');
                        var TongTienPhaiTra = SoLuong * DonGia;
                        var newRow = `<tr>
                                            <td>${MaSP}</td>
                                            <td>${Ten}</td>
                                            <td>${Ten_KH}</td>
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

function LayGiaBanVaTenSP() {
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
                    if (g_data[i].getAttribute('TamNgung') === 'true') {
                        alert('Sản Phẩm Đang Tạm Ngưng.')
                        $('#MA_SP').val('')
                    } else {
                        $('#GIA_BAN').val(g_data[i].getAttribute('GiaBan'))
                        $('#TEN_SP').val(g_data[i].getAttribute('Ten'))
                    }
                    return;
                }
            }
            alert('Mã SP không có, vui lòng kiểm tra lại');
        }
    }
}

function XoaSPBan(element) {
    let parent = $(element).parent().parent('tr');
    var MaSP = parent.find('td')[0].innerText;
    for(var i=0;i<DS_SPBAN.length ;i++) {
        if(DS_SPBAN[i].MA_SP === MaSP) {
            g_TongTien = g_TongTien - (+DS_SPBAN[i].SO_LUONG * +DS_SPBAN[i].GIA_BAN)
            $('#DS_BAN_TONG_TIEN').val(g_TongTien);
            DS_SPBAN.splice(i,1);
            break;
        } 
    }
    console.log(DS_SPBAN);
    g_table_ban.row(parent).remove().draw();
}

function ThemVaoDanhSachBan() {
    var MA_SP = $('#MA_SP').val().toUpperCase();
    if (MA_SP === "") {
        alert('Không được để trống Mã SP')
    } else {
        var SO_LUONG = $('#SO_LUONG').val()
        if (SO_LUONG == "" || parseInt(SO_LUONG) <= 0 || isNaN(parseInt(SO_LUONG))) {
            alert('Số lượng không được bỏ trống, là số nguyên lớn hơn 0');
        } else {
            var GIA_BAN = $('#GIA_BAN').val();
            var TEN_SP = $('#TEN_SP').val();
            var TONG_TIEN = +GIA_BAN * +SO_LUONG
            g_TongTien += TONG_TIEN;
            $('#DS_BAN_TONG_TIEN').val(g_TongTien.toLocaleString());
            var data = {
                MA_SP: MA_SP,
                GIA_BAN: GIA_BAN,
                TEN_SP: TEN_SP,
                SO_LUONG: SO_LUONG
            }
            var i = 0;
            while (i < DS_SPBAN.length) {
                if (DS_SPBAN[i].MA_SP === MA_SP) {
                    DS_SPBAN[i].SO_LUONG = +DS_SPBAN[i].SO_LUONG + (+SO_LUONG);
                    break;
                }
                i++;
            }
            if (i >= DS_SPBAN.length) {
                DS_SPBAN.push(data);
                var newRow = `<tr>
                                <td>${MA_SP}</td>
                                <td>${TEN_SP}</td>
                                <td>${SO_LUONG}</td>
                                <td>${GIA_BAN}</td>
                                <td>${TONG_TIEN.toLocaleString()}</td>
                                <td>
                                    <button type="button" onclick="XoaSPBan(this)" class="btn btn-primary">Xóa</button>
                                </td>
                            </tr>`;
                g_table_ban.row.add($(newRow));
            }
            else {
                g_table_ban.clear().draw();
                for (var j = 0; j < DS_SPBAN.length; j++) {
                    var tt = +DS_SPBAN[j].SO_LUONG * +GIA_BAN
                    var newRow = `<tr>
                                    <td>${DS_SPBAN[j].MA_SP}</td>
                                    <td>${DS_SPBAN[j].TEN_SP}</td>
                                    <td>${DS_SPBAN[j].SO_LUONG}</td>
                                    <td>${DS_SPBAN[j].GIA_BAN}</td>
                                    <td>${tt.toLocaleString()}</td>
                                    <td>
                                        <button type="button" onclick="XoaSPBan(this)" class="btn btn-primary">Xóa</button>
                                    </td>
                                </tr>`;
                    g_table_ban.row.add($(newRow));
                }
            }
            g_table_ban.draw();
        }
    }
}

function TinhTien() {
    if (DS_SPBAN.length == 0) {
        alert('Chưa có sản phẩm nào.');
    }
    else {
        var TenKhachHang = $('#TEN_KHACH_HANG').val();
        if (TenKhachHang === "") {
            alert('Không được để trống Tên Khách Hàng')
        }
        else {
            var session = getCookie('session')
            var NGAY_BAN = $('#NGAY_BAN').val();
            var TEN_SP = $('#TEN_SP').val();
            var GIA_BAN = $('#GIA_BAN').val();
            var data = {
                'session': session,
                'NGAY_BAN': NGAY_BAN,
                'TEN_KH': TenKhachHang,
                'DS_SP': JSON.stringify(DS_SPBAN)
            }
            console.log(data);

            $.ajax({
                url: 'http://localhost:3001/TinhTien',
                method: 'POST',
                dataType: 'text',
                data: JSON.stringify(data),
                error: function (request, status, error) {
                    alert(request.responseText);
                },
                success: function (data) {
                    alert(data);
                    g_TongTien = 0;
                    DS_SPBAN = [];
                    location.reload();
                }
            })
        }
    }
}