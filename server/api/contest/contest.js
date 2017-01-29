var Promise = require('bluebird');
var ContestSrv = require('../../service/contest');
var DelaySrv = require('../../service/delay');

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
