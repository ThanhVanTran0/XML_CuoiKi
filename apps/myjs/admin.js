var duongDan = 'images/';

function getData() {
	var xhttp = new XMLHttpRequest();
	var query = 'http://localhost:3001/DanhSachSanPham';
	xhttp.open('GET', query, false);
	xhttp.send();
	var Danh_sach_san_pham = xhttp.responseXML.getElementsByTagName('SanPham');
	return Danh_sach_san_pham;
}

function HienThiDanhSachSanPham(Danh_sach_san_pham,table) {
	var length = Danh_sach_san_pham.length;
	table.clear().draw();
	for (var i = 0; i < length; i++) {
		var MASP = Danh_sach_san_pham[i].getAttribute('MaSP');
		var Ten = Danh_sach_san_pham[i].getAttribute('Ten');
		var GiaBan = Danh_sach_san_pham[i].getAttribute('GiaBan');
		var TamNgung = Danh_sach_san_pham[i].getAttribute('TamNgung');
		var img_src = duongDan + MASP + '.jpg';

		var tinh_trang;
		if(TamNgung=="false") {
			tinh_trang = '';
		}
		else {
			tinh_trang = 'checked';
		}

		var newRow = `<tr>
						<td>
							<div class="sanpham_info">
								<img src="${img_src}" alt="" width="60px" height="60px">
							</div>
						</td>
						<td>${MASP}</td>
						<td>${Ten}</td>
						<td>
							<input type="text" name="" id="" value="${GiaBan}">
						</td>
						<td>
							<input type="checkbox" name="" id="" ${tinh_trang}>
						</td>
						<td>
							<button type="button" class="btn btn-primary" disabled>Cập Nhật</button>
						</td>
					</tr>`;
		table.row.add($(newRow));
	}
	table.draw();
}

//Selection loại sản phẩm
function TaoDanhSachLoaiSP(Danh_sach_san_pham) {
	var length = Danh_sach_san_pham.length;

	var Danh_sach = [];

	for (var i = 0; i < length; i++) {
		var LOAI_SP = Danh_sach_san_pham[i].childNodes[1];
		var MA_LOAI = LOAI_SP.getAttribute('MaLoai');

		if (Danh_sach.indexOf(MA_LOAI) == -1) {
			Danh_sach.push(MA_LOAI);
		}
	}

	var INPUT_LOAI_SP = document.getElementById('inputLoaiSP');
	var option = document.createElement('option');
	option.setAttribute('value', 'ALL');
	option.innerHTML = 'ALL';
	INPUT_LOAI_SP.appendChild(option);

	length = Danh_sach.length;
	for (var i = 0; i < length; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', Danh_sach[i]);
		option.innerHTML = Danh_sach[i];
		INPUT_LOAI_SP.appendChild(option);
	}
}

function LoaiSPThayDoi() {
	var LOAI_SP = document.getElementById('inputLoaiSP').value;
	var Danh_sach_moi = TaoDanhSachSPTheoLoai(data, LOAI_SP);
	HienThiDanhSachSanPham(Danh_sach_moi,g_table)
}

//Lấy ra danh sách SP theo loại SP
function TaoDanhSachSPTheoLoai(Danh_sach_san_pham, Loai) {
	var length = Danh_sach_san_pham.length;
	var Danh_sach_moi = document.createElement('Danh_Sach');

	for (var i = 0; i < length; i++) {
		var LOAI_SP = Danh_sach_san_pham[i].childNodes[1];
		var MA_LOAI = LOAI_SP.getAttribute('MaLoai');

		if (Loai.localeCompare(MA_LOAI) == 0 || Loai.localeCompare('ALL') == 0) {
			var node = Danh_sach_san_pham[i].cloneNode(true);
			Danh_sach_moi.appendChild(node);
		}
	}

	Danh_sach_moi = Danh_sach_moi.getElementsByTagName('SanPham');
	return Danh_sach_moi;
}