var UserSrv = require('./user');
var Delay = require('../models/delay');
var Contest = require('../models/contest');

var updateDelay = function(userId, contestId, value, callback) {
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
module.exports.updateDelay = updateDelay;

module.exports.update = function(attr, callback) {
	if (attr.userId != null) {
		return updateDelay(attr.userId, attr.contestId, attr.value, callback);
	}
	if (attr.username != null) {
		return UserSrv.lookup(attr.username, function(error, doc) {
			if (error || !doc) {
				return callback('Internal error');
			}
			updateDelay(doc._id, attr.contestId, attr.value, callback);
		});
	}
	callback('Wrong query');
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

