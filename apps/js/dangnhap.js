
function validateForm() {

	var id = document.getElementById('formID').value;
	var pass = document.getElementById('formPass').value;

	if(id == '') {
		alert('Tên đăng nhập không được để trống');
	}
	else {
		if(pass == '' ) {
			alert('Password không được để trống');
		}
		else {
			return true;
		}
	}

	return false;
}