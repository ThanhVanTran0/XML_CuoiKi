var fs = require("fs");
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;

var path = __dirname + '/../San_Pham'

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
    console.log('Gia: ' + GIA_BAN_MOI + ' tn: ' + Tam_ngung);
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

module.exports = {
    thay_Doi_San_Pham: thay_Doi_San_Pham
}
