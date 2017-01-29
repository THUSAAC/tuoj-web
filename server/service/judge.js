var Step = require('step');
var randomString = require('randomstring');
var fs = require('fs-extra');
var path = require('path');
var Judge = require('../models/judge')

module.exports.create = function (problemId, codeContent, language, userId, contestId, contestProblemId, callback) {
    Step(function () {
		this.fileName = randomString.generate(16) + '.' + userId + '.' + contestId + '.' + contestProblemId + '.answer';
		var stream = fs.createWriteStream(path.resolve(__dirname, '../../staticdata', this.fileName));
		stream.write(codeContent, 'base64');
		stream.end(this);
    }, function (err) {
        if (err) {
			return callback(err || 'Internal error'), undefined;
		}
        var judge = new Judge({
            user: userId,
            contest: contestId,
            problem: problemId,
            problem_id: contestProblemId,
            case_count: 10,
            submitted_time: Date.now(),
            lang: language,
            source_file: this.fileName,
            score: 0,
            status: 'Pending',
            results: null
        });
        judge.save(this);
    }, function(err, j) {
		if (err) {
			return callback(err || 'Internal error'), undefined;
		}
        callback(null, j);
    });
};


