var Judge = require('../models/judge');
var Contest = require('../models/contest');
var Problem = require('../models/problem');
var Role = require('../models/role');
var Step = require('step');

module.exports.getRanklist = function(contestId, attr, resv, callback) {
	var self = this;
	Step(function() {
		Contest.findOne({ 
			_id: contestId 
		}).populate('problems', {
			title: true,
		}).exec(this);
	}, function(err, contest) {
		if (err || !contest) {
			return callback('Contest not found'), undefined;
		}
		self.problems = contest.problems;
		Role.find({
			contest: contestId,
			role: 'player'
		}).populate('user', {
			username: true,
			realname: true,
			school: true
		}).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback('No player found'), undefined;
		}
		self.userlist = doc;
		Judge.find(attr).exec(this);
	}, function(err, judges) {
		const ignores = [ 'Dangerous Program', 'Compilation Error' ];
		var list = [];
		var userMap = {};
		for (var i in self.userlist) {
			var u =  self.userlist[i].user;
			if (u == null || attr.user !== undefined && u._id != attr.user) {
				continue;
			}
			userMap[u._id] = list.length;
			list.push({
				_id: u._id,
				username: u.username,
				realname: u.realname,
				school: u.school,
				details: {}
			});
		}
		for (var i in judges) {
			var judge = judges[i];
			if (ignores.indexOf(judge.status) !== -1) {
				continue;
			}
			if (userMap[judge.user] === undefined) {
				continue;
			}
			var listitem = list[userMap[judge.user]];
			if (listitem.details[judge.problem_id] === undefined 
					|| listitem.details[judge.problem_id].submitted_time < judge.submitted_time) {
				listitem.details[judge.problem_id] = {
					judge_id: judge._id,
					submitted_time: judge.submitted_time,
					score: resv ? judge.score : 'Submitted'
				};
			}
		}
		for (var i in list) {
			if (!resv) {
				list[i].total_score = 'Unknown';
				continue;
			}
			list[i].total_score = 0;
			for (var j in self.problems) {
				if (list[i].details[j] !== undefined) {
					list[i].total_score += list[i].details[j].score;
				}
			}
		}
		return callback(null, {
			problems: self.problems,
			list: list
		});
	});
};
