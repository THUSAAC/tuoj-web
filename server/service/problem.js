var randomString = require('randomstring');
var fs = require('fs-extra');
var path = require('path');
var Step = require('step');
var fstream = require('fstream');
var tar = require('tar');
var md5Dir = require('md5-dir');
var Problem = require('../models/problem');

module.exports.getCaseScore = function(problem, caseId) {
	var s = problem.cases[caseId - 1];
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

var generateTar = function(dataPath, hash, callback) {
	try {
		var data = path.resolve(__dirname, '../../staticdata', dataPath);
		var dest = path.resolve(__dirname, '../../staticdata', dataPath + '.' + hash + '.tar');
		fs.removeSync(dest);
		fs.ensureDirSync(data);
		var dirDest = fs.createWriteStream(dest);
		var packer = tar.Pack({ 
			noProprietary: true
		}).on('error', callback).on('end', callback);
		fstream.Reader({ 
			path: data,
			// type: 'Directory'
		}).pipe(packer).pipe(dirDest);
	} catch (error) {
		callback(error);
	}
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
		md5Dir(localPath, this);
	}, function(error, hash) {
		if (error) {
			return callback('Problem hash error'), undefined;
		}
		this.hash = hash;
		Problem.update({
			_id: problemId
		}, {
			$set: {
				local: localPath,
				dataMD5: hash
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
		this.data = doc.data;
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
			}).exec(this);
		} catch(error) {
			return callback(error), undefined;
		}
		generateTar(this.data, this.hash, callback);
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
	Step(function() {
		Problem.findOneAndUpdate({
			_id: problemId
		}, {
			$set: data
		}).exec(this);
	}, function(error, doc) {
		if (error) {
			return callback('DB update error');
		}
		this.md5 = doc.dataMD5;
		this.data = doc.data;
		try {
			var dataPath = path.resolve(__dirname, '../../staticdata', doc.data);
			var descPath = path.resolve(__dirname, '../../staticdata', doc.description);
			fs.ensureDirSync(dataPath);
			var newData = {
				cases: data.cases,
				langs: data.langs
			};
			fs.writeFileSync(path.join(dataPath, 'prob.json'), JSON.stringify(newData), 'utf-8');
			fs.ensureSymlinkSync(path.join(dataPath, 'prob.json'), descPath + '.config');
			newMd5 = md5Dir(dataPath, this);
		} catch (error) {
			return callback(error);
		}
	}, function(error, hash) {
		if (error) {
			return callback('md5 calc error');
		}
		if (hash === this.md5) {
			return callback(false), undefined;
		}
		this.hash = hash;
		Problem.update({
			_id: problemId
		}, {
			$set: {
				dataMD5: hash
			}
		}).exec(this);
	}, function(error) {
		if (error) {
			return callback('DB update error');
		}
		generateTar(this.data, this.hash, callback);
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

module.exports.addFile = function(problemId, attr, callback) {
	Problem.findById(problemId).exec(function(err, doc) {
		if (err || !doc) {
			return callback('Problem error');
		}
		try {
			var dataPath = path.resolve(__dirname, '../../staticdata', doc.data);
			fs.ensureDirSync(dataPath);
			fs.writeFileSync(path.resolve(dataPath, attr.filename), attr.code, 'base64');
		} catch (error) {
			console.log(error);
			return callback('Writing error');
		}
		callback(false);
	});
};

module.exports.addPublicFile = function(attr, callback) {
	var id = 'publicfile.' + randomString.generate(16) + '.' + attr.filename;
	try {
		var dataPath = path.resolve(__dirname, '../../staticdata', id);
		fs.ensureDirSync(dataPath);
		fs.writeFileSync(path.resolve(dataPath, attr.filename), attr.code, 'base64');
	} catch (error) {
		console.log(error);
		return callback('Writing error');
	}
	callback(false, '/staticdata/' + path.join(id, attr.filename));
};

