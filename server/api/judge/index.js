var express = require('express');
var router = express.Router();
var JudgeCtrl = require('./judge');

router.post('/api/judge/get_task', JudgeCtrl.checkJudger, JudgeCtrl.getTask);
router.post('/api/judge/update_results', JudgeCtrl.checkJudger, JudgeCtrl.updateResults);

module.exports = router;

