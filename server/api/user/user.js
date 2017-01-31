var UserSrv = require('../../service/user');
var RoleSrv = require('../../service/role');

module.exports.login = function(req, res, next){
	if (typeof(req.body.username) !== 'string') {
		return res.status(400).send('No username');
	}
	UserSrv.auth(req.body.username, req.body.password, function(error, doc) {
		if (error) {
			return res.status(400).send(error);
		}
		req.session.user = doc;
		req.session.user.password = null;
		res.status(200).send('Succeeded');
	});
};

module.exports.logout = function(req, res, next) {
	req.session.user = undefined;
	res.status(200).send('Succeeded');
};

module.exports.lookup = function(req, res, next) {
	var username = req.session.user ? req.session.user.username : null;
	if (typeof(req.body.username) === 'string') {
		username = req.body.username;
	}
	if (typeof(username) !== 'string') {
		return res.status(200).send('Wrong require');
	}
	UserSrv.lookup(username, function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Finding error');
		}
		res.status(200).send(doc);
	});
};

module.exports.time = function(req, res, next) {
	res.status(200).send({
		time: Date.now()
	});
};

module.exports.isRoot = function(req, res, next) {
	UserSrv.isRoot(req.session.user._id).exec(function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send({
			isRoot: doc && true
		});
	});
};
