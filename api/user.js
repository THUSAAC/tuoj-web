var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next) {
	if (!req.session.is_admin) {
		return next();
	}
	var dict = {'user':req.session.user,'is_admin':req.session.is_admin,call:req.session.call};
	res.render('user',dict);
});

module.exports = router;
