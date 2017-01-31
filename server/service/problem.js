var randomString = require('randomstring');
var fs = require('fs-extra');
var path = require('path');
var Step = require('step');
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

module.exports.create = function(callback) {
	var problem = new Problem({
		title: 'New problem to be configured',
	});
	problem.save().then(function(doc) {
		var data = doc._id + '.' + randomString.generate(16);
		var description = doc._id + '.' + randomString.generate(16);
		Problem.update({
			_id: doc._id
		}, {
			data: data,
			description: description,
			local: path.resolve(__dirname, '../../staticdata', data)
		}).exec(callback);
	}).catch(function(error) {
		callback(error);
	});
};

module.exports.list = function(attr) {
	return Problem.find(attr);
};

module.exports.syncLocal = function(problemId, localPath, callback) {
	Step(function() {
		Problem.update({
			_id: problemId
		}, {
			$set: {
				local: localPath
			}
		}).exec(this);
	}, function(error) {
		if (error) {
			return callback('Problem update error'), undefined;
		}
		Problem.findById(problemId).exec(this);
	}, function(error, doc) {
		if (error || !doc) {
			return callback('Problem find error');
		}
		var dataPath = path.resolve(__dirname, '../../staticdata', doc.data);
		var descPath = path.resolve(__dirname, '../../staticdata', doc.description);
		try {
			if (dataPath !== doc.local) {
				fs.removeSync(dataPath);
				fs.copySync(doc.local, dataPath);
			}
		} catch (error) {
		}
		try {
			fs.ensureDirSync(dataPath);
			fs.ensureFileSync(path.join(dataPath, 'prob.json'));
			fs.ensureFileSync(path.join(dataPath, 'description.md'));
			fs.ensureSymlinkSync(path.join(dataPath, 'description.md'), descPath + '.description');
			fs.ensureSymlinkSync(path.join(dataPath, 'prob.json'), descPath + '.config');
			var contentStr = fs.readFileSync(path.join(dataPath, 'prob.json'));
			var cfg = JSON.parse(String(contentStr));
			Problem.update({
				_id: problemId
			}, {
				$set: {
					title: cfg.title,
					langs: cfg.langs || [],
					cases: cfg.cases || []
				}
			}).exec(callback);
		} catch(error) {
			return callback(error);
		}
	});
};

module.exports.config = function(problemId, config, callback) {
	var data = {
		title: config.title,
		local: config.local,
	};
	try {
		data.langs = JSON.parse(config.langs);
		data.cases = JSON.parse(config.cases);
	} catch (error) {
		return callback(error);
	}
	Problem.findOneAndUpdate({
		_id: problemId
	}, {
		$set: data
	}).exec(function(error, doc) {
		if (error) {
			return callback('DB update error');
		}
		try {
			var dataPath = path.resolve(__dirname, '../../staticdata', doc.data);
			var descPath = path.resolve(__dirname, '../../staticdata', doc.description);
			fs.ensureDirSync(dataPath);
			fs.writeFileSync(path.join(dataPath, 'prob.json'), JSON.stringify(data), 'utf-8');
			fs.ensureSymlinkSync(path.join(dataPath, 'prob.json'), descPath + '.config');
		} catch (error) {
			return callback(error);
		}
		callback(false);
	});
};

module.exports.updateDescription = function(problemId, text, callback) {
	Problem.findById(problemId).exec(function(err, doc) {
		if (err || !doc) {
			return callback('Problem error');
		}
		try {
			var dataPath = path.resolve(__dirname, '../../staticdata', doc.data);
			var descPath = path.resolve(__dirname, '../../staticdata', doc.description);
			fs.ensureDirSync(dataPath);
			fs.writeFileSync(path.resolve(__dirname, '../../staticdata', doc.data, 'description.md'), text, 'utf-8');
			fs.ensureSymlinkSync(path.join(dataPath, 'description.md'), descPath + '.description');
		} catch (error) {
			return callback('Writing error');
		}
		callback(false);
	});
};
