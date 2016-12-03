var express = require('express');
var router = express.Router();
var Judge = require('../../models/judge');

router.post('/', function(req, res, next) {
    if (!req.session.is_admin) {
        return next();
    }
    var attr = {};
    try {
        attr = JSON.parse(req.body.queryAttr);
    } catch (error) {
        return res.send({ error: error });
    }
    Judge.find(attr).populate('problem').populate('user').exec(function(err, doc) {
        res.send({ data: doc });
    });
});

module.exports = router;
