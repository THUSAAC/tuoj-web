var express = require('express');
var router = express.Router();

router.post('/' , function(req, res, next) {
	var myDate = new Date();
	var hours = myDate.getHours();
	if (hours < 10) hours = "0" + hours;
	var minutes = myDate.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	var seconds = myDate.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	var result = hours + ':' + minutes + ':' + seconds;
	res.send(result);
});

module.exports = router;
