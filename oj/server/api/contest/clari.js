var ClariSrv = require('../../service/clari');
var Promise = require('bluebird');

module.exports.getAll = function(req, res, next) {
	ClariSrv.list({
		to: req.session.user._id
	}).exec(function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.getNew = function(req, res, next) {
	ClariSrv.list({
		to: req.session.user._id,
		from: {
			$ne: req.session.user._id
		},
		status: 'unread'
	}).exec(function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		var tasks = [];
		for (var i in doc) {
			tasks.push(ClariSrv.read(doc[i]._id));
		}
		Promise.all(tasks).then(function() {
			res.status(200).send(doc);
		}).catch(function(error) {
			res.status(500).send('Internal error');
		});
	});
};

module.exports.send = function(req, res, next) {
	ClariSrv.broadcast(req.body, req.session.user._id, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

