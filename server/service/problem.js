var Problem = require('../models/problem');

module.exports.getCaseScore = function(problem, caseId) {
	var s = problem.cases[caseId];
	if (s == null) {
		return 0;
	} else if (s.score != null) {
		return s.score;
	} else {
		return Math.floor(100 / s.length);
	}
};

module.exports.title = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	Problem.findById(req.body.problemId).exec(function(error, doc) {
		res.status(200).send({
			title: doc.title
		});
	});
};

