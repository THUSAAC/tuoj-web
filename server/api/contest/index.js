var express = require('express');
var router = express.Router();
var UserSrv = require('../../service/user');
var ContestSrv = require('../../service/contest');
var ContestCtrl = require('./contest');

router.post('/list', UserSrv.needLogin, ContestCtrl.list);
router.post('/info', UserSrv.needLogin, ContestSrv.access, ContestCtrl.info);

module.exports = router;
