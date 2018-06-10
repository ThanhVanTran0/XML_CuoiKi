var fs = require("fs");
const xml2js = require("xml2js");
const DOMParser = require('xmldom').DOMParser;

var path = __dirname + '/../San_Pham';

var ds_SanPham = [];

var get_ds_San_Pham = () => {
    ds_SanPham = [];
    fs.readdirSync(path).forEach(file => {
        var filePath = path + "/" + file;

        var parser = new xml2js.Parser();
        var data = fs.readFileSync(filePath, "utf-8");

        parser.parseString(data, function (err, result) {
            ds_SanPham.push(result);
        })
    })
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(ds_SanPham);
    return xml
}

var get_tai_khoan = () => {
    var data = fs.readFileSync(__dirname + '/../Tai_Khoan/Tai_Khoan.xml',"utf-8");
    var Du_Lieu = new DOMParser().parseFromString(data,"text/xml").documentElement;
    return Du_Lieu.getElementsByTagName('TaiKhoan');
}

module.exports = {
    get_ds_San_Pham: get_ds_San_Pham,
    get_tai_khoan: get_tai_khoan

}