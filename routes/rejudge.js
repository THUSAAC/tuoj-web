var express = require('express');
var router = express.Router();
var fse = require('fs-extra');

var contest = require('../models/contest.js');
var problem = require('../models/problem.js');
var judge = require('../models/judge.js');
var user = require('../models/user.js');

router.get('/',function(req,res,next){
	if (!req.session.is_admin && !req.session.is_staff) {
		return next();
	}
	res.render('rejudge',{'judgelist':[],'globalid':'','globaltitle':'','globaluser':'','globalstatus':'','globalscore':'','user':req.session.user,'is_admin':req.session.is_admin,'call':req.session.call});
});

router.post('/',function(req,res,next){
	if (!req.session.is_admin) {
		return next();
	}
	var page=req.body.page;
	judge.find({}).populate("user").populate("problem").exec(function(err,judgelist) {
		var len=judgelist.length;
		if (page<1 || (page>parseInt((len-1)/10)+1 && len)) next();
		if (!len && page>1) next();
		var dict={'user':req.session.user,'is_admin':req.session.is_admin, call: req.session.call};

		var jlist=[];
		for(var i=0;i<len;i++){
			var judict={};
			judict.id=judgelist[i]._id;
			judict.title=judgelist[i].problem.title;
			if (!judgelist[i].user) {
				judict.user = 'Unknown';
			} else {
				judict.user=judgelist[i].user.username;
			}
			judict.status=judgelist[i].status;
			judict.score=judgelist[i].score;
			judict.contest=judgelist[i].contest;
			var newtime=new Date();
			newtime.setTime(judgelist[i].submitted_time);
			judict.time=newtime.toLocaleString();
			var able=true;
			if (req.body.id!='' && req.body.id!=judict.id) able=false;
			if (req.body.title!='' && req.body.title!=judict.title) able=false;
			if (req.body.user!='' && req.body.user!=judict.user) able=false;
			if (req.body.status!='' && req.body.status!=judict.status) able=false;
			if (req.body.score!='' && req.body.score!=judict.score) able=false;
			if (able) jlist.push(judict);
		}
		dict.judgelist=jlist;
		dict.globalid=req.body.id;
		dict.globaltitle=req.body.title;
		dict.globaluser=req.body.user;
		dict.globalstatus=req.body.status;
		dict.globalscore=req.body.score;
		res.render('rejudge',dict);
	});
});

module.exports = router;
