var path = require('path');
var ProblemSrv = require('../../service/problem');
var FileSrv = require('../../service/file');

module.exports.list = function(req, res, next) {
	ProblemSrv.list({}).exec(function(error, doc) {
		if (error) {
			return res.status(500).status('Internal error');
		}
		res.status(200).send(doc);
	});
};

module.exports.create = function(req, res, next) {
	ProblemSrv.create(function(error) {
		if (error) {
			return res.status(500).status('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.getConfig = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.list({
		_id: req.body.problemId
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send(doc[0]);
	});
};

module.exports.syncLocal = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.syncLocal(req.body.problemId, req.body.local, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.config = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.config(req.body.problemId, req.body, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.updateDescription = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.updateDescription(req.body.problemId, req.body.descriptionText, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

module.exports.viewLocal = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.list({
		_id: req.body.problemId
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send(FileSrv.enumDir(path.resolve(__dirname, '../../../staticdata', doc[0].data)));
	});
};

module.exports.addFile = function(req, res, next) {
	if (req.body.problemId == null) {
		return res.status(400).send('Wrong query');
	}
	ProblemSrv.addFile(req.body.problemId, req.body, function(error) {
		if (error) {
			return res.status(500).send('Internal error');
		}
		res.status(200).send('Succeeded');
	});
};

