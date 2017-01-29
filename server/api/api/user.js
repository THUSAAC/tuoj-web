var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/', function(req, res, next) {
	if (!req.session.is_admin) {
		return next();
	}
	User.find({}).exec(function(err, doc){
		res.send({data : doc});
	});
});

router.post('/logout/', function(req, res, next) {
});

module.exports = router;
