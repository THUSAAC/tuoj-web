var DelaySrv = require('../../service/delay');

module.exports.list = function(req, res, next) {
	DelaySrv.getDelayList({
		contest: req.body.contestId
	}, function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.update = function(req, res, next) {
	if (req.body.value == null) {
		return res.status(400).send('Wrong query');
	}
	DelaySrv.update(req.body, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};
