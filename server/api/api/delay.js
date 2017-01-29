var router = require('express').Router();
var Step = require('step');
var Delay = require('../../service/delay.service');
var User = require('../../models/user');

router.post('/add', function(req, res, next) {
    if (!req.session.is_admin) {
        return next();
    }
    Step(function() {
        User.findOne({ username: req.body.username }, this);
    }, function(error, user) {
        if (error || !user) {
            return req.status(400).send('No such user'), undefined;
        }
        Delay.updateDelay(user._id, req.body.contestId, req.body.value, this);
    }, function(error) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.status(200).send({});
    });
});

router.post('/list', function(req, res, next) {
    if (!req.session.is_admin) {
        return next();
    }
    var attr = {};
    if (req.body.attrStr) {
        try {
            attr = JSON.parse(req.body.attrStr);
        } catch (error) {
        }
    }
    Delay.getDelayList(attr, function(error, doc) {
        if (error) {
            res.send({
                error: error
            });
        }
        res.send({ data: doc });
    });
});

module.exports = router;

