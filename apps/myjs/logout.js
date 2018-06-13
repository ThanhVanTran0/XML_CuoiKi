function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function Logout() {
    $.ajax({
        url: 'http://localhost:3002/logout',
        method: 'POST',
        error: function (request, status, error) {
            alert(request.responseText);
        },
        success: function (data) {
            eraseCookie('session');
            eraseCookie('name');
            location.href = '/index.html';
        }
    })
    return false;
}