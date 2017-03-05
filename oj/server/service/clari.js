var Promise = require('bluebird');
var Step = require('step');
var Clari = require('../models/clari');
var Role = require('../models/role');

module.exports.list = function(attr) {
	return Clari.find(attr, {
		from: true,
		text: true,
		time: true
	}).populate('from', {
		realname: true,
		username: true
	});
};

module.exports.read = function(clariId) {
	return Clari.update({
		_id: clariId
	}, {
		$set: {
			status: 'read'
		}
	});
};

var send = function(from, to, text) {
	var clari = new Clari({
		from: from,
		to: to,
		time: Date.now(),
		text: text,
		status: 'unread'
	});
	return new Promise(function(resolve, reject) {
		clari.save(function(error) {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	});
};

module.exports.broadcast = function(attr, userId, callback) {
	if (!attr.text || attr.text.length > 512) {
		return callback('Error text');
	}
	Step(function() {
		Role.findOne({
			contest: attr.contestId, 
			user: userId
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback('Denied'), undefined;
		}
		if (doc.role === 'player') {
			Role.find({
				$or: [ {
					contest: attr.contestId,
					role: 'master'
				}, {
					contest: attr.contestId,
					role: 'viewer'
				}, {
					contest: attr.contestID,
					role: 'setter'
				} ]
			}).exec(this);
		} else if (attr.to != null) {
			Role.find({
				contest: attr.contestId,
				user: attr.to
			}).exec(this);
		} else {
			Role.find({
				contest: attr.contestId,
			}).exec(this);
		}
	}, function(error, doc) {
		if (error || !doc) {
			return callback('Denied'), undefined;
		}
		var tasks = [];
		for (var i in doc) {
			if (userId !== doc[i].user) {
				tasks.push(send(userId, doc[i].user, attr.text));
			}
		}
		tasks.push(send(userId, userId, attr.text));
		Promise.all(tasks).then(function() {
			callback();
		}).catch(callback);
	});
};

