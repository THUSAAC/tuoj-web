var JudgeSrv = require('../../service/judge');
var DaemonSrv = require('../../service/daemon');

module.exports.statusList = function(req, res, next) {
	try {
		var attr = JSON.parse(req.body.queryAttr);
		JudgeSrv.findJudges(attr, true, false, function(error, doc) {
			if (error) {
				return res.status(500).send('Internal error');
			}
			res.status(200).send(doc);
		});
	} catch (error) {
		res.status(500).send('Internal error');
	}
};

module.exports.rejudge = function(req, res, next) {
	try {
		JudgeSrv.findJudges(req.body, true, false, function(error, doc) {
			if (error) {
				return res.status(500).send('Internal error');
			}
			var tasks = [];
			for (var i in doc) {
				tasks.push(new Promise(function(resolve, rejuect) {
					JudgeSrv.rejudge(doc[i]._id, function(error) {
						if (error) {
							return reject(error);
						}
						resolve();
					});
				}));
			}
			Promise.all(tasks).then(function() {
				return res.status(200).send('Successed');
			}).catch(function(error) {
				return res.status(500).send('Internal error');
			});
		});
	} catch (error) {
		res.status(500).send('Internal error');
	}
};

module.exports.judgers = function(req, res, next) {
	res.status(200).send(DaemonSrv.getList());
};

