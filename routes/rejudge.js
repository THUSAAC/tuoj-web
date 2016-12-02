var express = require('express');
var router = express.Router();
var fse = require('fs-extra');

var contest = require('../models/contest.js');
var problem = require('../models/problem.js');
var judge = require('../models/judge.js');
var user = require('../models/user.js');

router.get('/',function(req,res,next){
	var page=req.body.page;
	judge.find({}).populate("user").populate("problem").exec(function(err,judgelist) {
		var len=judgelist.length;
		if (page<1 || (page>parseInt((len-1)/10)+1 && len)) next();
		if (!len && page>1) next();
		var dict={'user':req.session.user,'is_admin':req.session.is_admin, call: req.session.call};

		var jlist=[];
		for(var i=0;i<len;i++){
			var judict={};
			//console.log(judgelist[i].user.username)
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
			jlist.push(judict);
		}
		dict.judgelist=jlist;
		res.render('rejudge',dict);
	});
});

module.exports = router;
