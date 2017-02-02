var Promise = require('bluebird');
var randomString = require('randomstring');
var UserSrv = require('../../service/user');

module.exports.add = function(req, res, next) {
	if (typeof(req.body.raw) !== 'string' || req.body.startno == null) {
		return res.status(400).send('Wrong query');
	}
	var raw = req.body.raw.split('\n');
	var startno = parseInt(req.body.startno);
	var prefix = req.body.prefix || 'contestant';
	var headers = [];
	var headerStr = raw[0].split('\t');
	for (var i in headerStr) {
		var row = headerStr[i];
		headers[i] = row;
	}
	var tasks = [];
	var ret = [];
	for (var i in raw) {
		var row = raw[i].split('\t');
		if (i == 0) {
			continue;
		}
		var userInfo = {
			username: prefix + (parseInt(i) + startno - 1),
			password: randomString.generate(6).toLowerCase()
		};
		for (var j in row) {
			if (headers[j]) {
				userInfo[headers[j]] = row[j];
			}
		}
		tasks.push(UserSrv.add(userInfo));
		ret.push(userInfo);
	}
	Promise.all(tasks).then(function() {
		res.status(200).send(ret);
	}).catch(function(error) {
		console.error(error);
		res.status(500).send('Internal error');
	});
};

module.exports.logoutAll = function(req, res, next) {
	UserSrv.logoutAll(function(error) {
		if (error) {
			console.error(error);
		}
		res.status(200).send('Succeeded');
	});
};
