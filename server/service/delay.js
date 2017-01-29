var Delay = require('../models/delay');
var Contest = require('../models/contest');

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
};

module.exports.getDelay = function(userId, contestId, callback) {
    Delay.findOne({
        user: userId,
        contest: contestId
    }).exec(function(error, doc) {
		if (error) {
			return callback(error);
		}
		if (!doc) {
			return callback(false, 0);
		}
		callback(false, doc.value * 60 * 1000);
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

