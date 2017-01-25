var express = require('express');
var router = express.Router();
var Step = require('step');

var User = require('../models/user.js');
/* GET home page. */

router.get('/', function(req, res, next) {
	var session = req.session;
	// console.log(session.user);
	res.render('homepage', {
        title: "TUOJ",
        user: session.user,
		call: session.call,
        is_admin: req.session.is_admin
	});
});

router.get('/login',function(req,res,next) {
	//console.log(req.session);
	if (req.session.user) {
	    return next(new Error("Please logout first!"));
    }
    res.render('login',{user:req.session.user});
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});

router.post('/login',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({"username": username, "password": password}, function(err,x){
        if (!x) {
            err = new Error("Error Username or Password");
            return next(err);
		}
		req.session.user = username;
		req.session.call = x.realname;
		req.session.is_admin = x.is_admin;
		req.session.is_staff = x.is_staff;
		req.session.uid = x._id;
        res.redirect('/');
	});
});

router.post('/sign_up', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	var user = new User({
		username: username,
		password: password,
		email: email
	});

	Step(function () {
		user.validate_info(this);
    }, function (err) {
		if (err) throw err;
		user.save(this);
	}, function (err) {
		if (err) return next(err);
		res.redirect("/login");
	});
});

module.exports = router;
