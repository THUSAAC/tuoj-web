var Judge = require('../models/judge');
var Contest = require('../models/contest');
var Problem = require('../models/problem');
var Step = require('step');

var filterProblems = function(raw) {
	var res = [];
	for (var i in raw) {
		if (raw[i]._id === undefined) {
			continue;
		}
		res.push({
			id: raw[i]._id,
			title: raw[i].title
		});
	}
	return res;
};

module.exports.getRanklist = function(contestId, userId, fullRanklist, callback) {
	var self = this;
	Step(function() {
		Contest.findOne({ _id: contestId }).populate('problems').exec(this);
	}, function(err, contest) {
		if (err || !contest) {
			return callback('Contest not found'), undefined;
		}
		self.problems = contest.problems;
		self.released = contest.released || fullRanklist;
		this(false);
	}, function(err) {
		var attr = {
			contest: contestId,
		};
		if (!fullRanklist) {
			attr.user = userId;
		}
		Judge.find(attr).populate('user').exec(this);
	}, function(err, judges) {
		var list = [];
		var userMap = {};
		for (var i in judges) {
			var judge = judges[i];
			if (userMap[judge.user._id] === undefined) {
				userMap[judge.user._id] = list.length;
				list.push({
					user: judge.user,
					details: {}
				});
			}
			var listitem = list[userMap[judge.user._id]];
			if (listitem.details[judge.problem_id] === undefined 
					|| listitem.details[judge.problem_id].submitted_time < judge.submitted_time) {
				listitem.details[judge.problem_id] = {
					judge_id: judge._id,
					submitted_time: judge.submitted_time,
					score: self.released ? judge.score : 'submitted'
				};
			}
		}
		for (var i in list) {
			if (!self.released) {
				list[i].total_score = 'unknown';
				continue;
			}
			list[i].total_score = 0;
			for (var j in self.problems) {
				if (list[i].details[j] !== undefined) {
					list[i].total_score += list[i].details[j].score;
				}
			}
		}
		if (self.released) {
			list.sort(function(a, b) {
				return - a.total_score + b.total_score;
			});
		}
		return callback(null, {
			problems: filterProblems(self.problems),
			list: list
		});
	});
};
