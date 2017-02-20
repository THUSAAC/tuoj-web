var express = require('express');
var router = express.Router();
var JudgeCtrl = require('./judge');

router.post('/get_task', JudgeCtrl.checkJudger, JudgeCtrl.getTask);
router.post('/update_results', JudgeCtrl.checkJudger, JudgeCtrl.updateResults);

module.exports = router;

