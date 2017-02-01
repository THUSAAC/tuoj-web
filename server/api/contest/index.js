var express = require('express');
var router = express.Router();
var UserSrv = require('../../service/user');
var ContestSrv = require('../../service/contest');
var ProblemSrv = require('../../service/problem');
var RoleSrv = require('../../service/role');
var ContestCtrl = require('./contest');
var CarliCtrl = require('./carli');

router.post('/list', UserSrv.needLogin, ContestCtrl.list);
router.post('/info', UserSrv.needLogin, ContestSrv.accessible, ContestCtrl.info);
router.post('/content', UserSrv.needLogin, ContestSrv.available, ContestCtrl.content);
router.post('/problemconf', UserSrv.needLogin, ContestSrv.available, ContestCtrl.problemConf);
router.post('/submit', UserSrv.needLogin, ContestSrv.submittable, ContestCtrl.submit);
router.post('/status', UserSrv.needLogin, ContestSrv.available, ContestCtrl.getStatus);
router.post('/cases', UserSrv.needLogin, ContestSrv.available, ContestCtrl.getCases);
router.post('/ranklist', UserSrv.needLogin, ContestSrv.available, ContestCtrl.ranklist);
router.post('/config', UserSrv.needLogin, ContestSrv.isMaster, ContestCtrl.config);
router.post('/role', UserSrv.needLogin, ContestSrv.getRole);
router.post('/problemTitle', UserSrv.needLogin, ContestSrv.isMaster, ProblemSrv.title);
router.post('/players', UserSrv.needLogin, ContestSrv.isMaster, RoleSrv.users);
router.post('/modifyRole', UserSrv.needLogin, ContestSrv.isMaster, ContestCtrl.modifyRole);
router.post('/create', UserSrv.needLogin, UserSrv.needRoot, ContestCtrl.create);
router.post('/carliall', UserSrv.needLogin, ContestSrv.accessible, CarliCtrl.getAll);
router.post('/carlinew', UserSrv.needLogin, ContestSrv.accessible, CarliCtrl.getNew);
router.post('/carlisend', UserSrv.needLogin, ContestSrv.accessible, CarliCtrl.send);

module.exports = router;
