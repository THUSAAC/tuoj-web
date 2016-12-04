var router = require('express').Router();
router.use('/judge', require('./judge'));
router.use('/rejudge', require('./rejudge'));
router.use('/time', require('./time'));
router.use('/status', require('./status'));
router.use('/notification', require('./notification'));
router.use('/user',require('./user'));
module.exports = router;
