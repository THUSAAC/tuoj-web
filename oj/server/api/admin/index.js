var express = require('express');
var router = express.Router();
var UserSrv = require('../../service/user');
var ProblemCtrl = require('./problem');
var JudgeCtrl = require('./judge');
var DocCtrl = require('./doc');
var UserCtrl = require('./user');

router.post('/problemlist', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.list);
router.post('/problemcreate', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.create);
router.post('/problemgetConfig', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.getConfig);
router.post('/problemsyncLocal', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.syncLocal);
router.post('/problemconfig', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.config);
router.post('/problemupdateDescription', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.updateDescription);
router.post('/problemviewLocal', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.viewLocal);
router.post('/problemaddFile', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.addFile);
router.post('/problemaddPublicFile', UserSrv.needLogin, UserSrv.needRoot, ProblemCtrl.addPublicFile);
router.post('/status', UserSrv.needLogin, UserSrv.needRoot, JudgeCtrl.statusList);
router.post('/judgers', UserSrv.needLogin, UserSrv.needRoot, JudgeCtrl.judgers);
router.post('/rejudge', UserSrv.needLogin, UserSrv.needRoot, JudgeCtrl.rejudge);
router.post('/docupdate', UserSrv.needLogin, UserSrv.needRoot, DocCtrl.update);
router.post('/useradd', UserSrv.needLogin, UserSrv.needRoot, UserCtrl.add);
router.post('/userlogoutAll', UserSrv.needLogin, UserSrv.needRoot, UserCtrl.logoutAll);

module.exports = router;
