var Promise = require('bluebird');
var Step = require('step');
var Judge = require('../../models/judge');
var JudgerSrv = require('../../service/judger');
var DaemonSrv = require('../../service/daemon');
var LockSrv = require('../../service/lock');
var config = require('../../config');

module.exports.checkJudger = function(req, res, next) {
	if (config.judgerToken !== req.body.token) {
		return res.status(400).send('Wrong token');
	}
	DaemonSrv.updateStatus(req);
	next();
};

var sendJudge = function(res, judge) {
	if (judge != null) {
		console.log('sending judge ' + judge._id);
		JudgerSrv.startJudge(judge._id);
	}
	return res.status(200).send(JudgerSrv.sendJudge(judge));
};
module.exports.getTask = function(req, res, next) {
	Step(function() {
		Judge.findOneAndUpdate({
			'type': 'cus',
			'status': 'Waiting', 
		}, {
			$set: {
				'status': 'Running'
			}
		}, {
			sort: {
				_id: 1
			}
		}).populate('problem').exec(this);
	}, function (error, doc) {
		if (error) {
			console.error(error);
			return res.status(500).send('Internal error'), undefined;
		}
		if (doc) {
			console.log('Found cus test');
			return sendJudge(res, doc), undefined;
		}
		Judge.findOneAndUpdate({
			'type': 'formal',
			'status': 'Waiting', 
		}, {
			$set: {
				'status': 'Running'
			}
		}, {
			sort: {
				_id: 1
			}
		}).populate('problem').exec(this);
	}, function(error, doc) {
		if (error) {
			console.error(error);
			return res.status(500).send('Internal error'), undefined;
		}
		if (doc) {
			console.log('found formal task');
			var remoteIp = (function(req) {
				return req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;
			})(req);
			console.log('given to ' + remoteIp);
			return sendJudge(res, doc), undefined;
		}
		sendJudge(res, null);
	});
};

module.exports.updateResults = function(req, res, next) {
	var tasks = [];
	for (var i in req.body.results) {
		tasks.push(JudgerSrv.updateResults(req.body.run_id, i, req.body.results[i]));
	}
	Promise.all(tasks).then(function() {
		res.status(200).send('Succeeded');
	}).catch(function(error) {
		console.error(error);
		res.status(500).send('Internal error');
	});
};

