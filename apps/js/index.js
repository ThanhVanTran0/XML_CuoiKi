
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

	}
};
console.log('Bat dau gui');
xhttp.open('GET','http://localhost:3001/test',true);
xhttp.send();