var randomString = require('randomstring');
var Step = require('step');
var path = require('path');
var fs = require('fs-extra');
var ProblemSrv = require('./problem');
var JudgeSrv = require('./judge');
var Judge = require('../models/judge');
var Problem = require('../models/problem');
var ContestSrv = require('./contest');
var Role = require('../models/role');

module.exports.submittable = function(req, res, next) {
	ContestSrv.info(req.body.contestId).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Invalid contest');
		}
		if (Date.now() + 30 * 60 * 1000 < doc.end_time) {
			return next();
		}
		Role.findOne({
			contest: req.body.contestId,
			user: req.session.user._id
		}).exec(function(error, doc) {
			if (error || !doc) {
				return res.status(400).send('Denied');
			}
			if (doc.role === 'viewer' || doc.role === 'master') {
				next();
			} else {
				return res.status(400).send('Denied');
			}
		});
	})
};

module.exports.create = function(userId, contestId, attr, callback) {
	Step(function() {
		Judge.findOne({
			contest: contestId,
			user: userId,
			type: 'cus',
			$or: [ {
				status: 'Uploading'
			}, {
				status: 'Waiting'
			}, {
				status: 'Running'
			} ]
		}).exec(this);
	}, function(error, doc) {
		if (error || doc) {
			return callback('Already had one in queue'), undefined;
		}
		this.prob = new Problem({
			title: 'Custom test',
		});
		this.prob.save(this);
	}, function(error) {
		if (error) {
			return callback(error), undefined;
		}
		var problemId = this.prob.get('_id');
		this.problemId = problemId;
		var data = problemId + '.' + randomString.generate(16) + '.cus';
		var desc = problemId + '.' + randomString.generate(16) + '.cus';
		var dataPath = path.resolve(__dirname, '../../staticdata', data);
		this.local = dataPath;
		try {
			fs.ensureDirSync(dataPath);
			fs.copySync(path.resolve(dataPath, '../cus.config.default'), path.join(dataPath, 'prob.json'));
			fs.copySync(path.resolve(dataPath, '../cus.description.default'), path.join(dataPath, 'description.md'));
			fs.ensureFileSync(path.join(dataPath, 'in'));
			if (typeof(attr.answer1) === 'string') {
				fs.writeFileSync(path.join(dataPath, 'in'), attr.answer1, 'base64');
			}
			fs.ensureFileSync(path.join(dataPath, 'out'));
			if (typeof(attr.answer2) === 'string') {
				fs.writeFileSync(path.join(dataPath, 'out'), attr.answer2, 'base64');
			}
		} catch (error) {
			return callback(error), undefined;
		};
		Problem.update({
			_id: problemId
		}, {
			data: data,
			description: desc,
			local: dataPath
		}).exec(this);
	}, function(error) {
		if (error) {
			return callback(error), undefined;
		}
		ProblemSrv.syncLocal(this.problemId, this.local, this);
	}, function(error) {
		if (error) {
			return callback(error), undefined;
		}
		Problem.findById(this.problemId).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback(error), undefined;
		}
		var newAttr = {};
		for (var i in attr) {
			if (i.match(/^answer\d*/) === null || i === 'answer0') {
				newAttr[i] = attr[i];
			}
		}
		JudgeSrv.create(doc, newAttr, attr.lang, userId, contestId, -1, 'cus', callback);
	});
};

module.exports.inQue = function(callback) {
	Judge.count({
		status: 'Waiting',
		type: 'cus'
	}).exec(callback);
};
