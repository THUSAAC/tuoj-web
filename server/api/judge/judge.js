var Promise = require('bluebird');
var Step = require('step');
var Judge = require('../../models/judge');
var JudgerSrv = require('../../service/judger');
var config = require('../../config');

module.exports.checkJudger = function(req, res, next) {
	if (config.judgerToken !== req.body.token) {
		return res.status(400).send('Wrong token');
	}
	next();
};


var sendJudge = function(res, judge) {
	if (judge != null) {
		JudgerSrv.startJudge(judge._id);
	}
	return res.status(200).send(JudgerSrv.sendJudge(judge));
};
module.exports.getTask = function(req, res, next) {
	Step(function() {
		Judge.findOne({
			'type': 'cus',
			'status': 'Waiting', 
		}).populate('problem').exec(this);
	}, function (error, doc) {
		if (error) {
			return res.status(500).send('Internal error'), undefined;
		}
		if (doc) {
			return sendJudge(res, doc), undefined;
		}
		Judge.findOne({
			'type': 'formal',
			'status': 'Waiting', 
		}).populate('problem').exec(this);
	}, function(error, doc) {
		if (error) {
			return res.status(500).send('Internal error'), undefined;
		}
		if (doc) {
			return sendJudge(res, doc), undefined;
		}
		sendJudge(res, null);
	});
};

module.exports.updateResults = function(req, res, next) {
	var tasks = [];
	for (var i in req.body.results) {
		tasks.push(JudgerSrv.updateResults(req.body.run_id, i, req.body.results[i]));
	}
	Promise.all(tasks).then(function() {
		res.status(200).send('Succeeded');
	}).catch(function(error) {
		res.status(500).send('Internal error');
	});
};

/*

router.post('/update_results/acm', function (req, res, next) {
	if (req.body.token != TOKEN) {
		return next();
	}
	var run_id  = parseInt(req.body.run_id);

	var j = null;

	Step(function () {
		Judge.findOne({_id: run_id}).populate('problem').exec(this);
	}, function (err, judge) {
		if (err) throw err;
		j = judge;

		if (!j) throw new Error("No such judge record.");
		j.updateStatus(req.body.results, this);
	}, function (err, judge) {
		if (err) throw err;
		j = judge;

		SubmitRecord.getSubmitRecord(j.user, j.contest, j.problem_id, this);
	}, function (err, s) {
		if (err) throw err;

		s.uploadLastSubmit(j, this);
	},  function (err) {
		if (err) {
			res.send({
				"status": "failure",
				"message": err.message,
				"stack": err.stack
			});
		} else {
			res.send({
				"status": "success"
			});
		}
	});
});

router.post('/get_task/system', function (req, res, next) {
	if (req.body.token != TOKEN) {
		return next();
	}
	Judge.findOne({'status': 'Waiting', $or: [{'lang': 'system_g++'}, {'lang': 'system_java'}]}).populate('problem').exec(function (err, x) {
		if (err) return next(err);
		if (!x) {
			return res.send({
				'run_id': -1
			})
		}
		x.status = 'Running';
		x.judge_start_time = Date.now();
		x.save(function (err, x) {
			if (err) return next(err);
			var lang = 'system';
			if (x.lang == 'system_g++') lang = 'g++';
			else if (x.lang == 'system_java') lang = 'java';
			info = {
				'run_id': x._id,
				'lang': lang,
				'source_url': x.getSourceURL()
			};
			res.send(info);
		});
	});
});

router.post('/update_results/system', function (req, res, next) {
	if (req.body.token != TOKEN) {
		return next();
	}
	var run_id = parseInt(req.body.run_id);
	var judge;
	Step(function () {
		Judge.findOne({_id: run_id}).exec(this);
	}, function (err, j) {
		if (err) throw err;
		var results = req.body.results;
		j.systemProblemUpdate(results, this);
	}, function (err, j) {
		if (err) throw err;
		judge = j;
		if (!(j.status == 'Running' || j.status == 'Waiting')) {
			SubmitRecord.getSubmitRecord(j.user, j.contest, j.problem_id, this);
		} else {
			this(null, null);
		}
	}, function(err, s) {
		if (err) throw err;
		if (s) {
			s.update(judge, this);
		} else {
			this(null, null);
		}
	}, function (err) {
		if (err) throw err;
		helper.systemProblemUpdateScore(judge.contest, judge.problem, this);
	}, function (err) {
		if (err) {
			res.send({
				"status": "failure",
				"message": err.message,
				"stack": err.stack
			});
		} else {
			res.send({
				"status": "success"
			});
		}
	});
});

module.exports = router;
*/
