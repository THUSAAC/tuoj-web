var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/fetch', function(req, res) {
    if (req.session.uid === undefined) {
        return res.send({});
    }
    User.findOne({
        _id: req.session.uid
    }, function(err, user) {
        if (err || !user || !user.notification || user.notification.length === 0) {
            return res.send({});
        }
        return res.send({
            text: user.notification
        });
    });
});

router.post('/receive', function(req, res) {
    if (req.session.uid === undefined) {
        return res.send({});
    }
    User.update({
        _id: req.session.uid,
        notification: req.body.notification
    }, {
        $set: {
            notification: ''
        }
    }, function(error) {
        res.send({ error: error });
    });
});

router.post('/broadcast', function(req, res) {
    if (!req.session.is_admin) {
        return res.redirect('/login');;
    }
    var text = req.body.text;
    User.update({
        is_admin: false
    }, {
        $set: {
            notification: text
        }
    }, {
		multi: true
	}).exec(function(error, raw) {
        if (error) {
            return res.send({ error: error });
        }
        return res.send({ res: raw });
    });
});

router.post("/notification", function(req, res) {
	if (!req.session.is_admin) {
		return res.redirect("/login");
	}
	var text = req.body.text;
	var uid = req.body.uid;
	User.update({
		_id : uid
	}, {
		$set: {
			notification: text
		}
	}, {
		multi: true
	}).exec(function(error, raw) {
		if (error) {
			return res.send({error : error});
		}
		return res.send({ res :raw});
	});
});

module.exports = router;

