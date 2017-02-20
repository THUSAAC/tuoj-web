var Role = require('../models/role');

module.exports.users = function(req, res, next) {
	Role.find({
		contest: req.body.contestId
	}).populate('user', {
		username: true,
		realname: true,
		school: true
	}).exec(function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.modify = function(attr, role, callback) {
	if (role === 'none') {
		return Role.remove(attr).exec(callback);
	}
	Role.update(attr, {
		$set: {
			role: role
		}
	}, {
		upsert: true
	}).exec(callback);
};
