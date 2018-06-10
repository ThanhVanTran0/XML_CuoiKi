
function Logout() {
    $.ajax({
        url:'http://localhost:3002/logout',
        method: 'POST'
    })
    return false;
}