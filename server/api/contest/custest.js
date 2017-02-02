var CustestSrv = require('../../service/custest');
var JudgeSrv = require('../../service/judge');

module.exports.create = function(req, res, next) {
	CustestSrv.create(req.session.user._id, req.body.contestId, req.body, function(error) {
		if (error) {
			return res.status(400).send('Denied');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.ok = function(req, res, next) {
	res.status(200).send('Succeeded');
};

module.exports.getStatus = function(req, res, next) {
	JudgeSrv.findJudges({
		contest: req.body.contestId,
		user: req.session.user._id,
		type: 'cus'
	}, true, true, function(error, doc) {
		if (error) {
			return res.status(400).send('Denied');
		}
		res.status(200).send(doc);
	});
};
