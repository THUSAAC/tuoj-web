var router = require('express').Router();
router.use('/judge', require('./judge'));
router.use('/rejudge', require('./rejudge'));
module.exports = router;
