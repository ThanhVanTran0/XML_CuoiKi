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
    var TONG_TIEN_1_SP = 0;

    if (length > 0) {
        // Lấy danh sách bán cuối cùng kiểm tra, nếu cùng ngày thì cập nhật
        var NGAY_BAN = dsPhieuBan[length - 1].getAttribute('Ngay');
        TONG_TIEN_1_SP = parseInt(data.SO_LUONG) * parseInt(data.GIA_BAN)
        if (data.NGAY_BAN === NGAY_BAN) {
            var dsSP = dsPhieuBan[length - 1].getElementsByTagName('SanPham');
            var length2 = dsSP.length
            var kt = false
            var tongtienmoi = parseInt(dsPhieuBan[length - 1].getAttribute('TongTien'));
            for (var j = 0; j < length2; j++) {
                var MaSP = dsSP[j].getAttribute('MaSP')
                var GIA_CU = dsSP[j].getAttribute('GiaBan');
                if (MaSP === data.MA_SP && GIA_CU === data.GIA_BAN) {
                    var soluongmoi = parseInt(dsSP[j].getAttribute('SoLuong')) + parseInt(data.SO_LUONG);
                    tongtienmoi += TONG_TIEN_1_SP;
                    dsSP[j].setAttribute('SoLuong', soluongmoi);
                    kt = true
                    break;
                }
            }
            if (kt == false) {
                var spRow = new DOMParser().parseFromString('<SanPham/>').documentElement
                spRow.setAttribute('MaSP', data.MA_SP);
                spRow.setAttribute('Ten', data.TEN_SP);
                spRow.setAttribute('SoLuong', data.SO_LUONG);
                spRow.setAttribute('GiaBan', data.GIA_BAN);
                tongtienmoi += TONG_TIEN_1_SP;
                dsPhieuBan[length - 1].appendChild(spRow)
            }
            dsPhieuBan[length - 1].setAttribute('TongTien', tongtienmoi);
        }
        else {
            // Trường hợp ngày bán là ngày mới
            var phieuBan = new DOMParser().parseFromString('<PhieuBanHang></PhieuBanHang>').documentElement;
            phieuBan.setAttribute('Ngay', data.NGAY_BAN)
            phieuBan.setAttribute('TongTien', TONG_TIEN_1_SP)
            var spRow = new DOMParser().parseFromString('<SanPham/>').documentElement
            spRow.setAttribute('MaSP', data.MA_SP);
            spRow.setAttribute('Ten', data.TEN_SP);
            spRow.setAttribute('SoLuong', data.SO_LUONG);
            spRow.setAttribute('GiaBan', data.GIA_BAN);
            phieuBan.appendChild(spRow);
            SP.appendChild(phieuBan)
        }
    } else {
        // Trường hợp mới tạo danh sách bán
        var phieuBan = new DOMParser().parseFromString('<PhieuBanHang></PhieuBanHang>').documentElement;
        phieuBan.setAttribute('Ngay', data.NGAY_BAN)
        phieuBan.setAttribute('TongTien', TONG_TIEN_1_SP)
        var spRow = new DOMParser().parseFromString('<SanPham/>').documentElement
        spRow.setAttribute('MaSP', data.MA_SP);
        spRow.setAttribute('Ten', data.TEN_SP);
        spRow.setAttribute('SoLuong', data.SO_LUONG);
        spRow.setAttribute('GiaBan', data.GIA_BAN);
        phieuBan.appendChild(spRow);
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
