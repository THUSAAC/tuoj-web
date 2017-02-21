var Daemon = function() {
	this.statusList = {};
	this.updateStatus = function(req) {
		var remoteIp = (function(req) {
			return req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;
		})(req);
		this.statusList[remoteIp] = Date.now();
	};
	this.getList = function() {
		return this.statusList;
	};
	return this;
};
module.exports = new Daemon;
