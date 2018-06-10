function Logout() {
    $.ajax({
        url: 'http://localhost:3002/logout',
        method: 'POST',
        error: function (request, status, error) {
            alert(request.responseText);
        },
        success: function (data) {
            alert('Đã Logout');
            location.href = '/index.html';
        }
    })
    return false;
}