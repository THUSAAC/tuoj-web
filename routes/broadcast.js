var express = require('express');
var router = express.Router();
var fse = require('fs-extra');

router.get('/',function(req,res,next){
	if (!req.session.is_admin) {
		return next();
	}
	res.render('broadcast',{'user':req.session.user,'is_admin':req.session.is_admin});
});

module.exports = router;
