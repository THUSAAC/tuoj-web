var pollSrv = [ '$interval', '$timeout', function($interval, $timeout) {
	var events = {};
	var ret = {};
	ret.push = function(exec, len, id) {
		events[id] = {
			exec: exec,
			len: len,
			cur: 1
		};
	};
	ret.pull = function(id) {
		events[id] = 0;
	};
	$interval(function() {
		for (var i in events) {
			-- events[i].cur;
			if (events[i].cur <= 0) {
				events[i].cur = events[i].len;
				$timeout(events[i].exec, 0);
			}
		}
	}, 1000);
	return ret;
} ];
