var fs = require('fs-extra');
var Step = require('step');
var path = require('path');
var randomstring = require('randomstring');
var Contest = require('../models/contest');
var Problem = require('../models/problem');
var Role = require('../models/role');
var DelaySrv = require('./delay');
var JudgeSrv = require('./judge');

module.exports.list = function(userId, callback) {
	Role.find({
		user: userId
	}).populate('contest', {
		hidden: true
	}).exec(callback);
};

module.exports.info = function(contestId) {
	return Contest.findById(contestId);
};

module.exports.accessible = function(req, res, next) {
	if (req.body.contestId == null) {
		return res.status(400).send('Access deined');
	}
	Role.findOne({
		contest: req.body.contestId,
		user: req.session.user._id
	}).populate('contest', {
		hidden: true
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Access deined');
		}
		if (doc.role === 'player' && doc.contest.hidden) {
			return res.status(400).send('Access deined');
		}
		next();
	});
};

var getContestStatus = function(ret) {
	var now = Date.now();
	if (now < ret.start_time) { 
		return 'unstarted';
	} else if (now > ret.end_time) {
		return 'ended';
	} else {
		return 'in_progress';
	}
};
module.exports.getContestStatus = getContestStatus;

module.exports.available = function(req, res, next) {
	var contestId = req.body.contestId;
	if (contestId == null) {
		return res.status(400).send('Wrong query');
	}
	Step(function() {
		Contest.findOne({
			_id: contestId
		}).exec(this);
	}, function(err, doc) {
		if (err || !doc) {
			return res.status(400).send('Contest does not exists'), undefined;
		}
		this.contest = doc;
		Role.findOne({
			user: req.session.user._id,
			contest: contestId
		}).exec(this);
	}, function(err, doc) {
		if (err || !doc) {
			return res.status(400).send('Access denied'), undefined;
		}
		if (doc.role === 'master') {
			return next();
		}
		if (this.contest.hidden || getContestStatus(this.contest) === 'unstarted') {
			return res.status(400).send('Access denied');
		}
		next();
	});
};

module.exports.submittable = function(req, res, next) {
	var contestId = req.body.contestId;
	if (contestId == null) {
		return res.status(400).send('Wrong query');
	}
	Step(function() {
		Role.findOne({
			contest: contestId,
			user: req.session.user._id
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Access denied'), undefined;
		}
		if (doc.role === 'master' || doc.role === 'viewer') {
			return next(), undefined;
		}
		Contest.findOne({
			_id: contestId
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Denied'), undefined;
		}
		if (Date.now() < doc.start_time) {
			return res.status(400).send('Denied'), undefined;
		}
		if (Date.now() <= doc.end_time) {
			return next(), undefined;
		}
		this.end_time = doc.end_time;
		DelaySrv.getDelay(req.session.user._id, doc._id, this);
	}, function(error, del) {
		if (error) {
			return res.status(500).send('Internal error'), undefined;
		}
		if (Date.now() <= this.end_time + del) {
			return next(), undefined;
		}
		res.status(400).send('Denied');
	});
};

module.exports.submit = function(userId, contestId, problemId, answers, callback) {
	Step(function() {
		Contest.findOne({
			_id: contestId
		}).populate('problems').exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback('Contest error'), undefined;
		}
		if (doc.problems[problemId] == null) {
			return callback('Problem error'), undefined;
		}
		this.problem = doc.problems[problemId];
		JudgeSrv.create(this.problem, answers, answers.lang, userId, contestId, problemId, 'formal', this);
	}, function(error, doc) {
		if (error) {
			return callback(error), undefined;
		}
		callback(false);
	});
};

module.exports.isResultVisible = function(userId, contestId, callback) {
	Step(function() {
		Role.findOne({
			user: userId, 
			contest: contestId
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback(false, false, false), undefined;
		}
		if (doc.role === 'master' || doc.role === 'viewer') {
			return callback(true, true, true), undefined;
		}
		Contest.findById(contestId).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback(false, false, false), undefined;
		}
		callback(doc.released || false, false, doc.published || false);
	});
};

module.exports.isMaster = function(req, res, next) {
	var contestId = req.body.contestId;
	if (contestId == null) {
		return res.status(400).send('Wrong query');
	}
	Role.findOne({
		contest: contestId,
		user: req.session.user._id,
		role: 'master'
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Access denied');
		}
		next();
	});
};

module.exports.getRole = function(req, res, next) {
	var contestId = req.body.contestId;
	if (contestId == null) {
		return res.status(400).send('Wrong query');
	}
	Role.findOne({
		contest: contestId,
		user: req.session.user._id,
		role: 'master'
	}).exec(function(error, doc) {
		res.status(200).send(doc);
	});
};

module.exports.config = function(contestId, conf, callback) {
	Contest.update({
		_id: contestId,
	}, {
		$set: conf
	}).exec(callback);
};

module.exports.create = function(owner, callback) {
	var contest = new Contest({
		start_time: Date.now() * 2,
		end_time: Date.now() * 2,
		title: 'New contest to be configured',
		hidden: true
	});
	contest.save(function(error, doc) {
		if (error) {
			return callback(error);
		}
		var role = new Role({
			user: owner,
			contest: doc._id,
			role: 'master'
		});
		role.save(callback);
	});
};;

