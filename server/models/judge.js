var mongoose = require("mongoose");
var path = require('path');
var autoIncrement = require("mongoose-auto-increment");
var Step = require('step');
var Schema = mongoose.Schema;

var Judge = new Schema({
    user: {type: Number, ref: "user"},
    contest: {type: Number, ref: "contest"},
    problem: {type: Number, ref: "problem"},
    problem_id: Number,
    submitted_time: Number,
    // solution information
    lang: String,
    source_file: Object,
    // judge result
    score: Number,
    case_count: Number,
});

Judge.index({ contest: 1, user: 1 });
Judge.index({ status: 1 });
Judge.index({ status: 1, lang: 1 });

Judge.plugin(autoIncrement.plugin, "Judge");

// traditional problem only
Judge.methods.updateStatus = function (results, callback) {
    self = this;
    try {
        Object.keys(results).forEach(function (test_id_str) {
            var test_id = parseInt(test_id_str);
            if (test_id < 0 || test_id > self.case_count) {
                return;
            }

            var result = results[test_id_str];
            //console.log(results[test_id_str]);
            self.results[test_id].status = result["status"];
            self.results[test_id].time = result["time"];
            self.results[test_id].memory = result["memory"];
            self.results[test_id].extInfo = result["extInfo"];

            var case_score = self.problem.getCaseScore(self. test_id - 1);
            if (typeof(result.score) == 'undefined') {
                if (self.results[test_id].status == "Accepted") {
                    self.results[test_id].score = case_score;
                }
            } else {
                self.results[test_id].score = Math.floor(result.score / 100 * case_score);
            }
        });

        var status = "Running";
        var finished = true;
        self.score = 0;
        self.results.forEach(function (s) {
            self.score += s.score;
            if (s.status == "Waiting") {
                finished = false;
            } else {
                if (s.status != "Accepted" && s.status != "Compilation Success" && status == "Running") {
                    status = s.status;
                }
            }
        });
        if (finished && status == "Running") {
            status = "Accepted"
        }
        self.status = status;

        self.markModified('results');
        self.save(callback);
    } catch (err) {
        callback(err);
    }
};

module.exports = mongoose.model("judge", Judge);
