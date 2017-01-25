var express = require('express');
var router = express.Router();
var Judge = require('../../models/judge');

router.post('/', function(req, res, next) {
    if (!req.session.is_admin) {
        return next();
    }
    var attr = {};
    try {
        attr = JSON.parse(req.body.queryAttr);
    } catch (error) {
        return res.send({ error: error });
    }
    Judge.find(attr, {
		contest: true,
		score: true,
		submitted_time: true,
		lang: true,
		status: true,
		problem: true,
		user: true
	}).sort({ _id: -1 })
		.limit(64)
		.populate('problem', { title: true })
		.populate('user', { realname: true, username: true })
		.exec(function(err, doc) {
			res.send({ data: doc });
		});
});

router.post('/count', function(req, res, next) {
	if (!req.session.is_admin) {
		return next();
	}
	Judge.count({}).exec(function(error, val) {
		res.send({
			count: val
		});
	});
});

module.exports = router;
