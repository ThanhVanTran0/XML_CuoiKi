
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

$('#formlogin').submit(function() {
	$.ajax({
		url: $('#formlogin').attr('action'),
		type: 'POST',
		data : $('#formlogin').serialize(),
		error: function(error) {
			alert('Error')
		},
		success: function(data){
		  location.href = data;
		}
	});
}) 