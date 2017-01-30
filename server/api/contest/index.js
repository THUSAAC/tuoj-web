var express = require('express');
var router = express.Router();
var UserSrv = require('../../service/user');
var ContestSrv = require('../../service/contest');
var ContestCtrl = require('./contest');

router.post('/list', UserSrv.needLogin, ContestCtrl.list);
router.post('/info', UserSrv.needLogin, ContestSrv.accessible, ContestCtrl.info);
router.post('/content', UserSrv.needLogin, ContestSrv.available, ContestCtrl.content);
router.post('/problemconf', UserSrv.needLogin, ContestSrv.available, ContestCtrl.problemConf);
router.post('/submit', UserSrv.needLogin, ContestSrv.submittable, ContestCtrl.submit);
router.post('/status', UserSrv.needLogin, ContestSrv.available, ContestCtrl.getStatus);
router.post('/cases', UserSrv.needLogin, ContestSrv.available, ContestCtrl.getCases);
router.post('/ranklist', UserSrv.needLogin, ContestSrv.available, ContestCtrl.ranklist);

module.exports = router;
