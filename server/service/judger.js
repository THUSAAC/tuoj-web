var Promise = require('bluebird');
var Judge = require('../models/judge');
var Case = require('../models/case');
var JudgeSrv = require('./judge');
var config = require('../config');
var LockSrv = require('./lock');

module.exports.sendJudge = function(judge) {
	if (judge == null) {
		return {
			run_id: -1
		};
	}
	try {
		console.log('Trying to parse ' + judge._id);
		var source_url = [];
		for (var i in judge.source_file) {
			if (i.match(/^answer\d*$/)) {
				source_url[parseInt(i.substr(6))] = config.siteURL + '/staticdata/' + judge.source_file[i];
			}
		}
		console.log('source parsed');
		return {
			run_id: judge._id,
			lang: judge.lang,
			source_url: source_url,
			data_md5: judge.problem.dataMD5,
			data_url: config.siteURL + '/staticdata/' + judge.problem.data + '.' + judge.problem.dataMD5 + '.tar'
		};
	} catch (error) {
		console.error(error);
		return {
			run_id: -1
		};
	}
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
				Case.find({
					$or: [ {
						judge: runId,
						status: 'Waiting'
					} , {
						judge: runId,
						status: 'Compilation Error'
					} ]
				}).exec(function(error, doc) {
					if (error || !doc || doc.length == 0) {
						return;
					}
					for (var i in doc) {
						if (doc[i].status === 'Compilation Error') {
							return;
						}
					}
				});
			}, timeEsti * 5);
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

var parseExtInfo = function(d) {
	if (typeof(d) === 'string') {
		return d;
	}
	var ret = '';
	for (var i in d) {
		if (i !== 'debug') {
			ret += i + ': ' + d[i] + '\n';
		}
	}
	return ret;
};

module.exports.updateResults = function(runId, caseId, data) {
	var frm = {
		runId: runId,
		caseId: caseId,
		status: data.status,
		score: data.score,
		time: data.time,
		memory: data.memory,
		extInfo: parseExtInfo(data.ext_info) 
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

