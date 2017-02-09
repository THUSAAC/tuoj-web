var express = require('express');
var router = express.Router();
var UserSrv = require('../../service/user');
var UserCtrl = require('./user');

router.post('/login', UserSrv.noLogin, UserCtrl.login);
router.post('/logout', UserSrv.needLogin, UserCtrl.logout);
router.post('/isroot', UserSrv.needLogin, UserCtrl.isRoot);
router.post('/lookup', UserCtrl.lookup);
router.post('/time', UserCtrl.time);
// router.post('/signup', UserSrv.noLogin);

module.exports = router;
