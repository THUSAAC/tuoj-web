var router = require('express').Router();
router.use('/judge', require('./judge'));
router.use('/rejudge', require('./rejudge'));
router.use('/status', require('./status'));
module.exports = router;
