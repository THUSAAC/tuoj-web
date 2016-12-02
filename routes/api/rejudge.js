var express = require('express');
var contest = require('../../models/contest.js')
var problem = require('../../models/problem.js')
var judge = require('../../models/judge.js')
var router = express.Router();

router.post('/', function(req, res, next) {
	if (!req.session.is_admin) {
		return next();
	}
	var now = req.body;
	if (now._id == '') delete now['_id'];
	if (now.title == '') delete now['title'];
	if (now.user == '') delete now['user'];
	if (now.status == '') delete now['status'];
	if (now.score == '') delete now['score'];
	judge.find(now).populate('contest').populate('problem').exec(function(err, doc) {
		var relist = [];
		for (var i in doc) {
			relist.push(doc[i]._id);
			doc[i].rejudge(function(err, jdoc) {
			});
		}
		res.redirect('/rejudge');
	});
});

module.exports = router;

