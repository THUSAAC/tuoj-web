var Lock = function() {
	var pool = {};
	var ret = {};
	ret.lock = function(id) {
		if (pool[id]) {
			return 'error';
		} else {
			pool[id] = true;
			return false;
		}
	};
	ret.unlock = function(id) {
		pool[id] = false;
	};
	return ret;
};

module.exports = new Lock();
