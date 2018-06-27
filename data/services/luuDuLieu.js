var fs = require("fs");
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;

var path = __dirname + '/../San_Pham'
var pathPBH = __dirname + '/../Phieu_Ban_hang'

var thay_Doi_San_Pham = (data) => {
    var Ma_SP = data.MA_SP;
    var filePath = path + "/" + Ma_SP + ".xml"
    var chuoiXml;
    try {
        chuoiXml = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        return false;
    }
    var SP = new DOMParser().parseFromString(chuoiXml, 'text/xml').documentElement;
    var GIA_BAN_MOI = data.GIA_BAN;
    var Tam_ngung = data.TAM_NGUNG;
    SP.setAttribute("GiaBan", GIA_BAN_MOI)
    if (Tam_ngung === true) {
        SP.setAttribute('TamNgung', 'true')
    } else {
        SP.setAttribute('TamNgung', 'false')
    }
    chuoiXml = new XMLSerializer().serializeToString(SP);
    chuoiXml = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" + chuoiXml;
    try {
        fs.writeFile(filePath, chuoiXml, 'utf-8');
        return true;
    } catch (error) {
        return false
    }
}

function ThemDSSP(PhieuBan,data) {
    var DS_SPBAN = JSON.parse(data.DS_SP);
    var tongtienmoi = parseInt(PhieuBan.getAttribute('TongTien'));
    for(var i=0;i<DS_SPBAN.length ;i++) {
        var spRow = new DOMParser().parseFromString('<SanPham/>').documentElement
        spRow.setAttribute('MaSP', DS_SPBAN[i].MA_SP);
        spRow.setAttribute('TenKH', data.TEN_KH);
        spRow.setAttribute('Ten', DS_SPBAN[i].TEN_SP);
        spRow.setAttribute('SoLuong', DS_SPBAN[i].SO_LUONG);
        spRow.setAttribute('GiaBan', DS_SPBAN[i].GIA_BAN);
        tongtienmoi += +DS_SPBAN[i].SO_LUONG * +DS_SPBAN[i].GIA_BAN;
        PhieuBan.appendChild(spRow);
    }
    PhieuBan.setAttribute('TongTien',tongtienmoi);
}

var Luu_Thong_Tin_Ban_SP = (data) => {
    var filePath = pathPBH + "/" + data.id + "_Phieu_Ban.xml"
    var chuoiXml = ""
    try {
        chuoiXml = fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
        return false
    }
    var SP = new DOMParser().parseFromString(chuoiXml, 'text/xml').documentElement;
    var dsPhieuBan = SP.getElementsByTagName('PhieuBanHang');
    var length = dsPhieuBan.length
    let DS_SPBAN =  JSON.parse(data.DS_SP);
    if (length > 0) {
        // Lấy danh sách bán cuối cùng kiểm tra, nếu cùng ngày thì cập nhật
        var NGAY_BAN = dsPhieuBan[length - 1].getAttribute('Ngay');
        if (data.NGAY_BAN === NGAY_BAN) {
            ThemDSSP(dsPhieuBan[length-1],data);
        }
        else {
            // Trường hợp ngày bán là ngày mới
            var phieuBan = new DOMParser().parseFromString('<PhieuBanHang></PhieuBanHang>').documentElement;
            phieuBan.setAttribute('Ngay', data.NGAY_BAN)
            phieuBan.setAttribute('TongTien', 0)
            ThemDSSP(phieuBan,data)
            SP.appendChild(phieuBan)
        }
    } else {
        // Trường hợp mới tạo danh sách bán
        var phieuBan = new DOMParser().parseFromString('<PhieuBanHang></PhieuBanHang>').documentElement;
        phieuBan.setAttribute('Ngay', data.NGAY_BAN)
        phieuBan.setAttribute('TongTien', 0)
        ThemDSSP(phieuBan,data)
        SP.appendChild(phieuBan)
    }

    chuoiXml = '<?xml version="1.0" encoding="UTF-8"?>' + new XMLSerializer().serializeToString(SP);
    try {
        fs.writeFile(filePath, chuoiXml, 'utf-8');
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    thay_Doi_San_Pham: thay_Doi_San_Pham,
    Luu_Thong_Tin_Ban_SP: Luu_Thong_Tin_Ban_SP
}
