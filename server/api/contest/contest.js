var Promise = require('bluebird');
var Step = require('step');
var ContestSrv = require('../../service/contest');
var DelaySrv = require('../../service/delay');
var JudgeSrv = require('../../service/judge');
var RanklistSrv = require('../../service/ranklist');
var UserSrv = require('../../service/user');
var RoleSrv = require('../../service/role');

module.exports.list = function(req, res, next) {
	ContestSrv.list(req.session.user._id, function(error, doc) {
		if (error) {
			console.error(error);
			return res.status(500).send(error);
		}
		res.status(200).send(doc);
	});
};

module.exports.info = function(req, res, next) {
	ContestSrv.info(req.body.contestId).exec(function(err, doc) {
		if (err || !doc) {
			return res.status(400).send('No such contest');
		}
		DelaySrv.getDelay(req.session.user._id, doc._id, function(error, del) {
			if (error) {
				return res.status(500).send('Internal error');
			}
			var ret = {
				start_time: doc.start_time,
				end_time: doc.end_time + del,
				title: doc.title,
				dashboard: doc.dashboard,
				released: doc.released,
				hidden: doc.hidden,
				_id: doc._id
			};
			ret.status = ContestSrv.getContestStatus(ret);
			res.status(200).send(ret);
		});
	});
};

module.exports.content = function(req, res, next) {
	ContestSrv.info(req.body.contestId).populate('problems', {
		title: true
	}).exec(function(err, doc) {
		if (err || !doc) {
			return res.status(400).send('No such contest');
		}
		res.status(200).send(doc.problems);
	});
};

module.exports.problemConf = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ContestSrv.info(req.body.contestId).populate('problems', {
		title: true,
		description: true
	}).exec(function(err, doc) {
		var prob = doc.problems[req.body.problemId];
		if (!prob) {
			return res.status(400).send('Problem not found');
		}
		res.status(200).send(prob);
	});
};

module.exports.submit = function(req, res, next) {
	ContestSrv.submit(req.session.user._id, req.body.contestId, req.body.problemId, req.body, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.getStatus = function(req, res, next) {
	Step(function() {
		ContestSrv.isResultVisible(req.session.user._id, req.body.contestId, this);
	}, function(resv, isGod) {
		var attr = {
			contest: req.body.contestId
		};
		if (req.body.requestOwn || !isGod) {
			attr.user = req.session.user._id;
		}
		if (req.body.runId != null) {
			attr._id = req.body.runId;
		}
		if (req.body.problem_id != null) {
			attr.problem_id = req.body.problem_id;
		}
		var getAnswer = (req.body.requestAnswer && ((attr.user === req.session.user._id)|| isGod))|| false;
		JudgeSrv.findJudges(attr, resv, getAnswer, this);
	}, function(error, doc) {
		if (error) {
			return res.status(500).send(error || 'Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.getCases = function(req, res, next) {
	Step(function() {
		ContestSrv.isResultVisible(req.session.user._id, req.body.contestId, this);
	}, function(resv, isGod) {
		if (!resv) {
			return res.status(200).send([]), undefined;
		}
		JudgeSrv.findCases(req.body.runId, this);
	}, function(error, doc) {
		if (error) {
			return res.status(500).send(error || 'Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.ranklist = function(req, res, next) {
	Step(function() {
		ContestSrv.isResultVisible(req.session.user._id, req.body.contestId, this);
	}, function(resv, isGod) {
		var attr = {
			contest: req.body.contestId
		};
		if (!isGod) {
			attr.user = req.session.user._id;
		}
		RanklistSrv.getRanklist(req.body.contestId, attr, resv, this);
	}, function(error, data) {
		if (error) {
			console.error(error);
			return res.status(500).send('Internal error');
		}
		res.status(200).send(data);
	});
};

module.exports.config = function(req, res, next) {
	var newConfig = {
		_id: req.body.contestId,
		start_time: req.body.start_time,
		end_time: req.body.end_time,
		title: req.body.title,
		dashboard: req.body.dashboard,
		problems: JSON.parse(req.body.problems),
		released: req.body.released,
		hidden: req.body.hidden
	};
	ContestSrv.config(newConfig, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.modifyRole = function(req, res, next) {
	Step(function() {
		if (req.body.userId != null) {
			return this(false, {
				_id: req.body.userId
			});
		} 
		UserSrv.lookup(req.body.username, this);
	}, function(error, data) {
		if (error || !data) {
			return res.status(400).send('Wrong query'), undefined;
		}
		RoleSrv.modify({
			contest: req.body.contestId,
			user: data._id
		}, req.body.role, this);
	}, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.create = function(req, res, next) {
	ContestSrv.create(req.session.user._id, function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

