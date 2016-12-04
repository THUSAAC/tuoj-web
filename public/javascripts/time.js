(function() {
	$(document).ready(function() {
		var showTime = function(){
			$.post('/api/time/',{}, function(res) {
				document.getElementById("nowtimes").innerHTML = res;
			});
			setTimeout(showTime , 1100);
		}
		showTime();
	});
})();
