


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
    //Table.clear().draw();
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
    
}