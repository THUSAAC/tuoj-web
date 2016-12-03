(function() {
	$(document).ready(function() {
		var fetch = function() {
			$.post('/api/notification/fetch', {}, function(res) {
				if (res.text) {
                    if (res.text === 'logout') {
                        window.location.href = '/logout';
                    } else if (res.text.split(' ')[0] === 'redirect') {
                        window.location.href = res.text.split(' ')[1];
                    } else {
                        alert('请注意:\n' + res.text);
                    }
					$.post('/api/notification/receive', { notification: res.text }, function(res) {
						if (res.error) {
							console.error(res.error);
						}
					});
				}
			});
			setTimeout(fetch, 8192);
		};
		fetch();
	});
})();
