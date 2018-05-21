var duongDan = 'images/';

function getData() {
	var xhttp = new XMLHttpRequest();
	var query = 'http://localhost:3001/DanhSachSanPham';
	xhttp.open('GET', query, false);
	xhttp.send();
	var Danh_sach_san_pham = xhttp.responseXML.getElementsByTagName('SanPham');
	return Danh_sach_san_pham;
}

function taoDanhSachHienThi(Danh_sach_san_pham) {
	var Title = $('<div></div>').addClass('product-name')
	Title.html(`<div class="one-forth text-center">
								<span>Sản Phẩm</span>
							</div>
							<div class="one-eight text-center">
								<span>Mã Sản Phẩm</span>
							</div>
							<div class="one-eight text-center">
								<span>Giá bán</span>
							</div>
							<div class="one-eight text-center">
								<span>Hiện Trạng</span>
							</div>`);
	var Danh_sach = document.createElement('div')
	Danh_sach.appendChild(Title[0])

	var length = Danh_sach_san_pham.length;

	for (var i = 0; i < length; i++) {
		var MASP = Danh_sach_san_pham[i].getAttribute('MaSP');
		var Ten = Danh_sach_san_pham[i].getAttribute('Ten');
		var GiaBan = Danh_sach_san_pham[i].getAttribute('GiaBan');
		var TamNgung = Danh_sach_san_pham[i].getAttribute('TamNgung');
		var img = duongDan + MASP + '.jpg';

		var product = document.createElement('div');
		product.className = 'product-cart'

		var one_forth = document.createElement('div');
		one_forth.className = 'one-forth';

			var product_img = document.createElement('div');
			product_img.className = 'product-img';
			product_img.style.backgroundImage = 'url(' + img + ')';

			var display_tc = document.createElement('div');
			display_tc.className = 'display-tc';

				var theTen = document.createElement('h3');
				theTen.innerHTML = Ten;

			display_tc.appendChild(theTen);

		one_forth.appendChild(product_img);
		one_forth.appendChild(display_tc);


		var one_eigt1 = document.createElement('div');
		one_eigt1.className = 'one-eight text-center';

			display_tc = document.createElement('div');
			display_tc.className = 'display-tc';

				var MA_SAN_PHAM = document.createElement('h3');
				MA_SAN_PHAM.innerHTML = MASP;
				
			display_tc.appendChild(MA_SAN_PHAM);

		one_eigt1.appendChild(display_tc);


		var one_eigt2 = document.createElement('div');
		one_eigt2.className = 'one-eight text-center';

			display_tc = document.createElement('div');
			display_tc.className = 'display-tc';

				var Gia = document.createElement('h3');
				Gia.innerHTML = GiaBan + ' VND';

			display_tc.appendChild(Gia);

		one_eigt2.appendChild(display_tc);

		var one_eigt3 = document.createElement('div');
		one_eigt3.className = 'one-eight text-center';

			display_tc = document.createElement('div');
			display_tc.className = 'display-tc';

				var TINH_TRANG = document.createElement('h3');
				if(TamNgung === 'false') {
					TINH_TRANG.innerHTML = 'Đang bán'
				}
				else {
					TINH_TRANG.innerHTML = 'Tạm ngưng'
				}

			display_tc.appendChild(TINH_TRANG);

		one_eigt3.appendChild(display_tc);

		product.appendChild(one_forth);
		product.appendChild(one_eigt1);
		product.appendChild(one_eigt2);
		product.appendChild(one_eigt3);

		Danh_sach.appendChild(product)
	}
	return Danh_sach;
}

//Selection loại sản phẩm
function TaoDanhSachLoaiSP(Danh_sach_san_pham) {
	var length = Danh_sach_san_pham.length;

	var Danh_sach = [];

	for (var i = 0 ;i< length ;i++) {
		var LOAI_SP = Danh_sach_san_pham[i].childNodes[1];
		var MA_LOAI = LOAI_SP.getAttribute('MaLoai');

		if(Danh_sach.indexOf(MA_LOAI) == -1) {
			Danh_sach.push(MA_LOAI);
		}
	}

	var INPUT_LOAI_SP = document.getElementById('inputLoaiSP');
	var option = document.createElement('option');
	option.setAttribute('value','ALL');
	option.innerHTML = 'ALL';
	INPUT_LOAI_SP.appendChild(option);

	length = Danh_sach.length;
	for(var i=0;i<length;i++) {
		var option = document.createElement('option');
		option.setAttribute('value',Danh_sach[i]);
		option.innerHTML = Danh_sach[i];
		INPUT_LOAI_SP.appendChild(option);
	}
}

function LoaiSPThayDoi() {
	var LOAI_SP = document.getElementById('inputLoaiSP').value;
	var Danh_sach_moi = TaoDanhSachSPTheoLoai(data,LOAI_SP);
	var Danh_sach = taoDanhSachHienThi(Danh_sach_moi);
	var DANH_SACH_SP = document.getElementById("DANH_SACH_SP");
	DANH_SACH_SP.innerHTML = "";
	DANH_SACH_SP.appendChild(Danh_sach);
	TaoDanhSachMaSP(Danh_sach_moi);
}

//Lấy ra danh sách SP theo loại SP
function TaoDanhSachSPTheoLoai(Danh_sach_san_pham,Loai) {
	var length = Danh_sach_san_pham.length;
	var Danh_sach_moi = document.createElement('Danh_Sach');

	for(var i = 0;i<length;i++) {
		var LOAI_SP = Danh_sach_san_pham[i].childNodes[1];
		var MA_LOAI = LOAI_SP.getAttribute('MaLoai');

		if(Loai.localeCompare(MA_LOAI) == 0 || Loai.localeCompare('ALL') == 0) {
			var node = Danh_sach_san_pham[i].cloneNode(true);
			Danh_sach_moi.appendChild(node);
		}
	}

	Danh_sach_moi = Danh_sach_moi.getElementsByTagName('SanPham');
	return Danh_sach_moi;
}

//Tạo list autocomplete mã SP
function TaoDanhSachMaSP(Danh_sach_sp) {
	var DATA_LIST = document.getElementById('listMASP');
	DATA_LIST.innerHTML = '';
	var option;

	var length = Danh_sach_sp.length;

	for(var i = 0 ;i <length;i++) {
		var MA_SP = Danh_sach_sp[i].getAttribute('MaSP');
		option = document.createElement('option');
		option.setAttribute('value',MA_SP);
		DATA_LIST.appendChild(option);
	}
}