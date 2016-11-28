var express = require('express');
var contest = require('../../models/contest.js')
var problem = require('../../models/problem.js')
var judge = require('../../models/judge.js')
var router = express.Router();

router.post('/rejudge', function(req, res, next) {
	if (!req.session.is_admin) {
		return next();
	}
	judge.find(req.attr).populate('contest').populate('problem').exec(function(err, doc) {
		var relist = [];
		for (var i in doc) {
			relist.push(doc[i]._id);
			doc[i].rejudge(function(err, jdoc) {
			});
		}
		res.send(relist);
	});
});

module.exports = router;

