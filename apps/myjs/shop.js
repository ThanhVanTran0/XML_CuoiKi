


function GetData()
{
    var request = new XMLHttpRequest();
    // Get data from BUS
    request.open("GET",'http://localhost:3001/DanhSachSanPham',false);
    request.send();

    var DanhSachSanPham = request.responseXML.getElementsByTagName("SanPham");
    return DanhSachSanPham;


}

function HienThiSanPham(san_pham)
{
    var so_luong = san_pham.length;
    var Table = document.getElementById('DS_SP');
    Table.innerHTML = '';
    for(var i=0; i<so_luong; i++)
    {
        var MASP = san_pham[i].getAttribute('MaSP');
		var Ten = san_pham[i].getAttribute('Ten');
        var GiaBan = san_pham[i].getAttribute('GiaBan');
        var MoTa = san_pham[i].getAttribute('MoTa');
        var img_src = 'images/' + MASP + '.jpg';

        var item = `<div class="col-md-4 text-center">
                        <div class="product-entry">
                            <div class="product-img" style="background-image: url(${img_src});">
                                <p class="tag">
                                    <span class="new">${MASP}</span>
                                </p>
                                <div class="cart">
                                    <p>${MoTa}</p>
                                </div>
                            </div>
                            <div class="desc">
                                <h3>
                                    <a href="#">${Ten}</a>
                                </h3>
                                <p class="price">
                                    <span>${GiaBan} VND</span>
                                </p>
                            </div>
                        </div>
                    </div>`;

        //var Node = document.createElement('div');
        //Node.innerHTML = item;
        //Table.appendChild(Node);
        Table.innerHTML +=item;
    }
    //Table.draw();
}

function LoaiSPThayDoi()
{
    var LoaiSP = document.getElementById('LoaiSP').value;
    var so_luong = San_Pham.length;

    var DanhSach = document.createElement("DanhSach");

    for(var i=0; i<so_luong; i++)
    {
        var LoaiSPNode = San_Pham[i].childNodes[1];
        var Ma = LoaiSPNode.getAttribute('MaLoai');
        if (LoaiSP.localeCompare(Ma) == 0 || LoaiSP.localeCompare('ALL') == 0) {
			var node = San_Pham[i].cloneNode(true);
			DanhSach.appendChild(node);
		}
	}

	DanhSach = DanhSach.getElementsByTagName('SanPham');
    
	HienThiSanPham(DanhSach);
}

function TaoDanhSachLoaiSP(san_pham)
{
    var so_luong = san_pham.length;

	var Danh_sach = [];

	for (var i = 0; i < so_luong; i++) {
		var LoaiSP = san_pham[i].childNodes[1];
		var Ma = LoaiSP.getAttribute('MaLoai');

		if (Danh_sach.indexOf(Ma) == -1) {
			Danh_sach.push(Ma);
		}
	}

	var InputLoaiSP = document.getElementById('LoaiSP');
	var option = document.createElement('option');
	option.setAttribute('value', 'ALL');
	option.innerHTML = 'ALL';
	InputLoaiSP.appendChild(option);

	so_luong = Danh_sach.length;
	for (var i = 0; i < so_luong; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', Danh_sach[i]);
		option.innerHTML = Danh_sach[i];
		InputLoaiSP.appendChild(option);
	}
}