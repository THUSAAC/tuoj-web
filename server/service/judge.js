var Step = require('step');
var Promise = require('bluebird');
var randomString = require('randomstring');
var fs = require('fs-extra');
var path = require('path');
var Judge = require('../models/judge');
var Case = require('../models/case');
var ProblemSrv = require('./problem');

var rejudge = function(runId, callback) {
	Judge.update({
		_id: runId
	}, {
		$set: {
			score: 0
		}
	});
	Case.update({
		judge: runId
	}, {
		$set: {
			status: 'Waiting',
			score: 0,
			time: 0,
			memory: 0,
			extInfo: ''
		}
	}, {
		multi: true
	}).exec(callback);
};
module.exports.rejudge = rejudge;

module.exports.create = function(problem, codeContent, language, userId, contestId, contestProblemId, callback) {
    Step(function() {
		this.fileName = {};
		var tasks = [];
		for (var i in codeContent) {
			if (typeof(i) === 'string' && i.match(/^answer\d*$/) !== null) {
				this.fileName[i] = randomString.generate(16) + '.' + userId + '.' + contestId + '.' + contestProblemId + '.' + i;
				tasks.push(fs.writeFile(path.resolve(__dirname, '../../staticdata', this.fileName[i]), codeContent[i], 'base64'));
			}
		}
		Promise.all(tasks).then(this);
    }, function () {
        var judge = new Judge({
			status: 'Waiting',
            user: userId,
            contest: contestId,
            problem: problem._id,
            problem_id: contestProblemId,
            case_count: problem.cases.length + 1,
            submitted_time: Date.now(),
            lang: language,
            source_file: this.fileName,
            score: 0,
        });
        judge.save(this);
    }, function(err, j) {
		if (err) {
			return callback(err || 'Internal error'), undefined;
		}
		for (var i = 0; i <= problem.cases.length; ++ i) {
			JudgeCase.update({
				judge: j._id,
				caseId: i,
			}, {
				$set: {
					fullScore: ProblemSrv.getCaseScore(problem, i),
					status: 'Waiting'
				}
			}, {
				upsert: true
			});
		}
		callback(false);
    });
};

module.exports.updateStatus = function(data, callback) {
	const statusPriority = [
		'Waiting',
		'Accepted',
		'Memory Limit Exceeded',
		'Runtime Error',
		'Time Limit Exceeded',
		'Compilation Error',
		'No Source',
		'Dangerous Program',
		'System Error'
	];
	Step(function() {
		Case.findOne({
			judge: data.runId,
			caseId: data.caseId
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback('Case error');
		}
		this.score = Math.floor(data.score * doc.fullScore / 100);
		this.status = data.status;
		Case.update({
			_id: doc._id
		}, {
			$set: {
				score: data.score,
				status: data.status,
				score: data.score,
				time: data.time,
				memory: data.time,
				finishedTime: Date.now()
			}
		}).exec(this);
	}, function(error) {
		if (error || !doc) {
			return callback(error || 'Case update error');
		}
		Judge.findById(runId).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback(error || 'Judge error');
		}
		var newStatus = doc.status;
		if (statusPriority.indexOf(newStatus) < statusPriority.indexOf(this.status)) {
			newStatus = this.status;
		}
		Judge.update({
			_id: runId
		}, {
			$set: {
				status: newStatus
			}, $inc: {
				score: this.score
			}
		}).exec(callback);
	});
};

module.exports.isAnswerVisible = function(runId, userId, callback) {
	Step(function() {
		Judge.findById(runId).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			callback(false);
		}
		callback(doc.user == userId);
	});
};

module.exports.findJudges = function(attr, resv, ansv, callback) {
	var keys = {
		user: true,
		problem: true,
		problem_id: true,
		submitted_time: true,
		lang: true,
		contest: true
	};
	if (resv) {
		keys.status = true;
		keys.score = true;
	}
	if (ansv) {
		keys.source_file = true;
	}
	Judge.find(attr, keys).populate('user', {
		username: true
	}).populate('problem', {
		title: true
	}).exec(callback);
};

module.exports.findCases = function(runId, callback) {
	Case.find({
		judge: runId
	}).exec(callback);
};

