function validateForm() {

	var id = document.getElementById('formID').value;
	var pass = document.getElementById('formPass').value;

	if (id == '') {
		alert('Tên đăng nhập không được để trống');
	} else {
		if (pass == '') {
			alert('Password không được để trống');
		} else {
			return true;
		}
	}
	return false;
}

function setCookie(cname, cvalue, time) {
	var d = new Date();
	d.setTime(d.getTime() + (time * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$('#formlogin').submit(function () {
	$.ajax({
		url: $('#formlogin').attr('action'),
		method: 'POST',
		data: $('#formlogin').serialize(),
		error: function (request, status, error) {
			alert(request.responseText);
		},
		success: function (data) {
			var data2 = JSON.parse(data);
			setCookie('session', data2.session, 1);
			setCookie('name', data2.name, 1);
			if (data2.isadmin === 'true') {
				location.href = '/admin.html'
			} else {
				location.href = '/NhanVien.html'
			}
		}
	});
	return false;
})