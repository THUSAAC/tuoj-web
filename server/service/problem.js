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
