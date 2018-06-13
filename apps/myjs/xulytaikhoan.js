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

var session = getCookie('session');
if (session === "" || session === "#") {
    $('#idTaiKhoan').html('Tài Khoản <b class="caret"></b>')
    $('#idDangNhap').show();
    $('#idLogOut').hide();
} else {
    var name = getCookie('name');
    if (name != "")
    {
        $('#idTaiKhoan').html(`${name} <b class="caret"></b>`)
        $('#idDangNhap').hide();
        $('#idLogOut').show();
    }
}
