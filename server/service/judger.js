var Promise = require('bluebird');
var Judge = require('../models/judge');
var Case = require('../models/case');
var JudgeSrv = require('./judge');
var config = require('../config');

module.exports.sendJudge = function(judge) {
	if (judge == null) {
		return {
			run_id: -1
		};
	}
	var source_url = [];
	for (var i in judge.source_file) {
		if (i.match(/^answer\d*$/)) {
			source_url[parseInt(i.substr(6))] = config.siteURL + '/staticdata/' + judge.source_file[i];
		}
	}
	return {
		run_id: judge._id,
		lang: judge.lang,
		source_url: source_url,
		data_md5: judge.problem.dataMD5,
		data_url: config.siteURL + '/staticdata/' + judge.problem.data + '.' + judge.problem.dataMD5 + '.tar'
	};
};

module.exports.startJudge = function(runId) {
	Judge.findById(runId).populate('problem').exec(function(error, doc) {
		if (error) {
			return error;
		}
		var timeEsti = 5000;
		for (var i in doc.problem.cases) {
			if (doc.problem.cases[i].time) {
				timeEsti += doc.problem.cases[i].time;
			} else {
				timeEsti += 5000;
			}
		}
		(function(runId) {
			setTimeout(function() {
				Case.findOne({
					judge: runId,
					status: 'Waiting'
				}).exec(function(error, doc) {
					if (error || doc) {
						Judge.update({
							_id: runId
						}, {
							$set: {
								status: 'System Error'
							}
						}).exec(function(error) {
						});
					}
				});
			}, timeEsti);
		})(runId);
		Judge.update({
			_id: runId
		}, {
			$set: {
				status: 'Running'
			}
		}).exec(function(error) {
		});
	});
};

module.exports.updateResults = function(runId, caseId, data) {
	if (typeof(caseId) === 'string' && caseId.match(/^comp/)) {
		caseId = 0;
	}
	var frm = {
		runId: runId,
		caseId: caseId,
		status: data.status,
		score: data.score,
		time: data.time,
		memory: data.time,
		extInfo: JSON.stringify(data.ext_info) 
	};
	return new Promise(function(resolve, reject) {
		JudgeSrv.updateStatus(frm, function(error) {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	});
};

