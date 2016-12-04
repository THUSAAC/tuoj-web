var Delay = require('../models/delay');
var Contest = require('../models/contest');

var delayList = {};

(function() {
    Delay.find({}).exec(function(err, doc) {
        if (doc) {
            for (var i in doc) {
                var delay = doc[i];
                if (!delayList[delay.user]) {
                    delayList[delay.user] = {};
                }
                delayList[delay.user][delay.contest] = delay.value;
            }
        }
    });
})();

module.exports.updateDelay = function(userId, contestId, value, callback) {
    Delay.update({
        user: userId,
        contest: contestId
    }, {
        $set: {
            value: value
        }
    }, {
        upsert: true
    }).exec(callback);
    if (!delayList[userId]) {
        delayList[userId] = {};
    }
    delayList[userId][contestId] = value;
};

module.exports.getDelaySync = function(userId, contestId) {
    if (delayList[userId]) {
        return delayList[userId][contestId] || 0;
    }
    return 0;
};

module.exports.getEndtime = function(userId, contestId, callback) {
    Delay.findOne({
        user: userId,
        contest: contestId
    }).populate('contest', { end_time: true })
        .exec(function(error, doc) {
            if (error) {
                return callback(error);
            }
            if (!doc) {
                return Contest.findOne({
                    _id: contestId
                }).exec(function(error, doc) {
                    if (error) {
                        return callback(error);
                    }
                    if (!doc) {
                        return callback('No such contest');
                    }
                    callback(false, doc.end_time);
                });
            }
            callback(false, doc.contest.end_time + doc.value * 60 * 1000);
        });
};

module.exports.getDelayList = function(attr, callback) {
    Delay.find(attr)
        .populate('contest', {
            title: true,
            end_time: true
        }).populate('user', {
            school: true,
            username: true,
            realname: true
        }).exec(callback);
};

