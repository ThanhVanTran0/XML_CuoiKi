
var fs = require("fs");
const xml2js = require("xml2js");

var path = __dirname + '/../San_Pham';

var ds_SanPham = [];

var get_ds_San_Pham = () => {
    fs.readdirSync(path).forEach(file => {
        var filePath = path + "/" + file;

        var parser = new xml2js.Parser();
        var data = fs.readFileSync(filePath,"utf-8");

        parser.parseString(data,function(err,result){
            ds_SanPham.push(result);
        })
    })
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(ds_SanPham);
    return xml   
}

module.exports = {
    get_ds_San_Pham: get_ds_San_Pham
}