var express = require('express')
var router = express.Router()
var git = require('nodegit')
var markdown = require('markdown').markdown
var fs = require('fs')
var fse = require('fs-extra')
var Step = require('step')
var contest = require('../models/contest')
var problem = require('../models/problem')
var judge = require('../models/judge')
var user = require('../models/user')
var SubmitRecord = require('../models/submit_record');
var helper = require('../service/helper');
var path = require('path')
var upload = require('../config').MULTER_UPLOAD
var randomstring = require('randomstring')
var SOURCE_DIR = require('../config').SOURCE_DIR
var ranklistService = require('../service/ranklist.service');
var Delay = require('../service/delay.service');

var checkContestAvailable = function(req, res, next) {
	var contestId = req.params.cid || req.params.contestId || req.params.id;
	contest.findOne({
		_id: contestId
	}).exec(function(err, doc) {
		if (!doc) {
			return res.status(400).send('Contest does not exists');
		}
		if (doc.hidden && !req.session.is_admin && !req.session.is_staff) {
			return res.status(400).send('Access denied');
		}
		next();
	});
};

router.get('/', function(req, res, next) {
	contest.find({},function(err,contestlist){
        if (err) return next(err);
		var dict={
			user: req.session.user,
			call: req.session.call,
			is_admin: req.session.is_admin,
			prestart: req.session.is_admin || req.session.is_staff
		};
		dict.contestlist=[];
        contestlist.reverse().forEach(function (item) {
            var d = new Date();
			if (item.hidden && !req.session.is_admin && !req.session.is_staff) {
				return;
			}
            dict.contestlist.push({
                id: item._id,
                name: item.name,
				hidden: item.hidden,
                status: item.get_status(Delay.getDelaySync(req.session.uid, item._id)),
                start_time: helper.timestampToString(item.start_time),
                end_time: helper.timestampToString(Number(item.end_time) + Delay.getDelaySync(req.session.uid, item._id) * 60 * 1000)
            });
        });
		res.render('contest_home',dict);
	});
});

router.get('/:id([0-9]+)', checkContestAvailable, function(req,res,next){
	var contestid=parseInt(req.params.id)
	contest.findOne({_id:contestid}).populate('problems').exec(function(err,x){
		if (err) return next(err)
		if (!x) return next()
        if (x.get_status() == 'unstated') return next(new Error('Contest is not in progress!'));

		var dict={
			user: req.session.user,
			call: req.session.call,
			is_admin: req.session.is_admin
		};
		dict.contestid=contestid;
		dict.contesttitle = x.name;
		dict.problems=x.problems;
		dict.start = new Date().setTime(x.star).toLocaleString();
		dict.end = new Date().setTime(x.end).toLocaleString();
        dict.status = x.get_status(Delay.getDelaySync(req.session.uid, contestid));
		dict.active = 'problems';
        dict.dashboard = x.dashboard;
		//console.log(x.problems[0])
		res.render('contest',dict);
	})
}) 


router.get('/:id([0-9]+)/status', checkContestAvailable,function(req,res,next){
	var self = this;
	var contestid=parseInt(req.params.id)
	var page=parseInt(req.params.page)
	var attr = {'contest':contestid}
	Step(function() {
		contest.findOne({ _id: contestid }, this);
	}, function(err, contest) {
		if (err || !contest) {
			console.error(err);
			return res.status(400).send('Contest not found'), undefined; 
		}
		self.released = contest.released || req.session.is_admin || req.session.is_staff;
		attr.user = req.session.uid;
		judge.find(attr).sort('-_id').populate('problem').populate('user').populate('contest').exec(this);
	}, function(err, judgelist){
		//console.log(judgelist)
		var len=judgelist.length;
		if (page<1 || (page>(len-1)/10+1 && len)) next();
		if (!len && page>1) next();
		var dict={
			user: req.session.user,
			call: req.session.call,
			is_admin: req.session.is_admin
		};
		dict.contestid=contestid;
		
		var jlist=[];
		for(var i=0;i<len;i++){
			var judict={};
			//console.log(judgelist[i].user.username)
			judict.id=judgelist[i]._id;
			judict.title=judgelist[i].problem.title;
			judict.problemid=judgelist[i].problem_id;
			if (!judgelist[i].user) {
				judict.user = 'Unknown';
			} else {
				judict.user=judgelist[i].user.username;
			}
			judict.status=judgelist[i].status;
			if (!self.released && judict.status.match(/Compilation*/) === null) {
				judict.status = 'Invisible';
			}
			judict.score=judgelist[i].score;
			if (!self.released) {
				judict.score = 0;
			}
			judict.lang = judgelist[i].lang;
			var newtime=new Date();
			newtime.setTime(judgelist[i].submitted_time);
			judict.time=newtime.toLocaleString();
			jlist.push(judict);
		}
		dict.judgelist=jlist;
		dict.active = 'status';
		if (judgelist.length) {
			dict.contestname = judgelist[0].contest.name;
		}
		res.render('contest_status',dict)
	});
})

router.post('/:id([0-9]+)/skip',function(req,res,next){
	var contestid=req.params.id
	var page=req.body.page
	res.redirect('/contests/'+contestid+'/status/');
})

router.get('/:cid([0-9]+)/problems/:pid([0-9]+)', checkContestAvailable,function(req,res,next){
	var self = this;
    var contestid=parseInt(req.params.cid);
	var problemid=parseInt(req.params.pid);
    contest.findOne({_id: contestid}).populate("problems").exec(function (err, c) {
		if (err) return next(err);
        if (!c) return next();
        if (c.get_status() == 'unstarted' && !req.session.is_admin && !req.session.is_staff) {
			return next(new Error('Contest is not in progress!'));
		}
		if (!c || problemid < 0 || problemid > c.problems.length) next()

		p = c.problems[problemid];
		// console.log(p);
		self.released = c.released || req.session.is_admin || req.session.is_staff;

		try {
			var description = p.getDescriptionHTML();
		} catch (err) {
			var description = JSON.stringify(err);
		}
		var dict={
			user: req.session.user,
			call: req.session.call,
			is_admin: req.session.is_admin
		};
		dict.title = p.title;
		dict.problem = p;
		dict.description = description;
		dict.problemid = problemid;
		dict.contestid = contestid;
		dict.active = 'problem';
        dict.langs = p.meta.supported_languages;
        SubmitRecord.getSubmitRecord(req.session.uid, c._id, problemid, function (err, s) {
            if (err) return next(err);
            dict.best_solution = s.judge;
            dict.submitted_times = s.submitted_times;
            judge.find({user: req.session.uid, contest: c._id, problem_id: problemid}).sort('-_id').exec(function (err, judge_staus) {
                if (err) return next(err);
                dict.judge_status = [];
				var tmpStatus = [];
                judge_staus.forEach(function (item) {
					if (!self.released && item.status.match(/Compilation*/) === null) {
						item.status = 'Invisible';
					}
					if (!self.released) {
						item.score = 0;
					}
                    tmpStatus.push({
                        _id: item._id,
                        submitted_time: helper.timestampToTimeString(item.submitted_time),
                        status: item.status,
                        score: item.score
                    });
                });
				dict.judge_status = tmpStatus;
                res.render('contest_problem', dict);
            });
        });
	});

});

router.post('/:cid([0-9]+)/problems/:pid([0-9]+)/upload', checkContestAvailable,upload.single('inputfile'),function(req,res,next){
	if (typeof(req.file) == 'undefined') {
        return next(new Error("Undefined file."));
    }
    if (req.file.size > 0.5 * 1024 * 1024) {
        return next(new Error("The solution size is at most 512 KB."));
    }

	var contest_id=parseInt(req.params.cid);
	var contest_problem_id=parseInt(req.params.pid);

	var c = null;

	Step(function () {
		contest.findOne({_id: contest_id}).populate('problems').exec(this);
	}, function (err, new_contest) {
		if (err) throw err;
		c = new_contest;
		if (contest_problem_id >= c.problems.length || contest_problem_id < 0) {
			return res.status(400).send("No such problem."), undefined;
		}
		if (c.get_status(Delay.getDelaySync(req.session.uid, contest_id)) != 'in_progress' && !req.session.is_admin && !req.session.is_staff) {
			return res.status(400).send('Contest is not in progress!'), undefined;
		}

		SubmitRecord.getSubmitRecord(req.session.uid, contest_id, contest_problem_id, this);
	}, function (err, s) {
		if (err) throw err;
		s.submit_record += 1;
		s.save(this)
	},function (err) {
		if (err) throw err;
		var p = c.problems[contest_problem_id];
		judge.new(p, req.file.path, req.body.language, req.session.uid, c, contest_problem_id, this);
	},  function (err) {
		if (err) return next(err);
		else res.redirect('/contests/'+contest_id+'/status/');
	});
});

router.post('/rejudge/:id([0-9]+)/:judgeid([0-9]+)',function(req,res,next){
	var contestId = parseInt(req.params.id);
    var judgeId = parseInt(req.params.judgeid);
	judge.findOne({_id:judgeId}).populate('contest').populate('problem').exec(function(err,x){
        if (err) return next(err);
        x.rejudge(function (err, x) {
            if (err) return next(err);
            res.redirect('/contests/' + x.contest._id + '/detail/' + x._id);
        });
	})
});

router.get('/:contestId/detail/:judgeId', checkContestAvailable, function(req, res, next) {
	var self = this;
    var contestId = req.params.contestId;
    var judgeId = req.params.judgeId;
    judge.findOne({ _id: judgeId }).populate('user').populate('problem').populate('contest').exec(function(err, doc) {
        if (err) return next(err);
        if (err || !doc) {
            return res.status(400).render('error', {
                status: 400,
                message: 'No such submission'
            });
        }

		self.released = doc.contest.released || req.session.is_admin || req.session.is_staff;
        var has_permission = req.session.is_admin || req.session.is_staff || (req.session.user  == doc.user.username); 
		// 是管理员或者是自己的提交

        if (!has_permission) {
            return res.status(400).render('error', {
                status: 400,
                message: 'Access denied'
            });
        }
		if (!self.released && doc.status.match(/Compilation*/) === null) {
			doc.status = 'Invisible';
		}
		if (!self.released) {
			doc.score = 0;
			for (var i in doc.results) {
				doc.results[i].score = 0;
				doc.results[i].status = 'Invisible';
				doc.results[i].time = 'Invisible';
				doc.results[i].memory = 'Invisible';
				doc.results[i].extInfo = undefined;
			}
		}
        var renderArgs = {
            id: doc._id,
            problem_id: doc.problem_id,
            problem_name: doc.problem.title,
            lang: doc.lang,
            source: 'Source not found',
            status: doc.status,
            score: doc.score,
            results: doc.results
        };
		if (!doc.user) {
			renderArgs.user = 'Unknown';
		} else {
            renderArgs.user = doc.user.username;
		}

        if (doc.lang == 'system_g++' || doc.lang == 'system_java') {
            var total_time = 0;
            for (var i = 1; i < doc.results.length; i++) {
                total_time += doc.results[i].time;
            }
            renderArgs.total_time = total_time;
        } else {
            try {
				if (doc.lang === 'answerzip') {
					renderArgs.source = 'Unsupported format';
				} else {
					renderArgs.source = fs.readFileSync(path.resolve(__dirname, '../public/source', doc.source_file));
				}
            } catch (error) {
            }
        }

        // console.log(renderArgs);

        res.status(200).render('judge_detail', {
            active: 'judge_detail',
            title: 'TUOJ Judge details',
            contestid: contestId,
            user: req.session.user,
            call: req.session.call,
            is_admin: req.session.is_admin,
            res: renderArgs
        });
    });
});

router.get('/:cid([0-9]+)/rank_list', checkContestAvailable, function (req, res, next) {
	var contest_id = parseInt(req.params.cid);
	var attr = {_id: contest_id};
	ranklistService.getRanklist(contest_id, req.session.uid, req.session.is_admin || req.session.is_staff, function (err, ranklist) {
		if (err) return next(err);
		var renderArgs = {
			user: req.session.user,
			call: req.session.call,
			is_admin: req.session.is_admin,
			canViewCode: req.session.is_admin || req.session.is_staff,
			// is_frozen: c.is_frozen(),
			contestid: contest_id,
			problems: ranklist.problems,
			players: ranklist.list,
			active: 'ranklist'
		};
		res.status(200).render('contest_ranklist', renderArgs);
	});
});

module.exports = router;

