var Promise = require('bluebird');
var Step = require('step');
var User = require('../models/user');
var Role = require('../models/role');
var mongoose = require('mongoose');

module.exports.noLogin = function(req, res, next) {
	if (req.session.user) {
		return res.status(400).send('Already login');
	}
	next();
};

module.exports.needLogin = function(req, res, next) {
	if (req.session.user === undefined) {
		return res.status(400).send('Pleas login first');
	}
	next();
};

module.exports.auth = function(username, password, callback) {
	User.findOne({
		username: username
	}).exec(function(error, doc) {
		if (error || !doc) {
			return callback('No such user');
		} else if (doc.password !== password){
			return callback('Wrong password');
		}
		callback(false, doc);
	});
};

module.exports.lookup = function(username, callback) {
	User.findOne({
		username: username
	}).select({
		username: true,
		realname: true,
		school: true,
		email: true
	}).exec(callback);
};

module.exports.isRoot = function(userId) {
	return Role.findOne({
		user: userId,
		contest: -1,
		role: 'root'
	});
};

module.exports.needRoot = function(req, res, next) {
	Role.findOne({
		user: req.session.user._id,
		contest: -1,
		role: 'root'
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Access deined');
		}
		next();
	});
};

module.exports.needSettingAuthority = function(req, res, next) {
	Role.findOne({
		$or: [ {
			user: req.session.user._id,
			contest: -1,
			role: 'root'
		} ,{
			user: req.session.user._id,
			contest: contestId,
			role: 'setter'
		} ]
	}).exec(function(error, doc) {
		if (error || !doc) {
			return res.status(400).send('Access deined');
		}
		next();
	});
};

module.exports.add = function(info) {
	return new Promise(function(resolve, reject) {
		User.remove({
			username: info.username
		}).exec(function(error) {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	}).then(function() {
		return User(info).save();
	});
};

module.exports.logoutAll = function(callback) {
	Step(function() {
		mongoose.connection.db.dropCollection('sessions', this);
	}, function(error) {
		callback(error);
	});
};
