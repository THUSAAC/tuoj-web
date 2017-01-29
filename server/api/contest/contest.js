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
	if (req.body.contestId == null) {
		return res.status(400).send('Wrong require');
	}
	ContestSrv.info(req.body.contestId, function(err, doc) {
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
				_id: doc._id
			};
			var now = Date.now();
			if (now < ret.start_time) { 
				ret.status = 'unstarted';
			} else if (now > ret.end_time) {
				ret.status = 'ended';
			} else {
				ret.status = 'in_progress';
			}
			res.status(200).send(ret);
		});
	});
};

