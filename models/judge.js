var mongoose = require("mongoose");
var path = require('path');
var urljoin = require('url-join');
var fse = require('fs-extra');
var autoIncrement = require("mongoose-auto-increment");
var randomstring = require('randomstring');
var Step = require('step');
var Schema = mongoose.Schema;

var SOURCE_DIR = require('../config').SOURCE_DIR;
var SITE_URL = require('../config').SITE_URL;

var Judge = new Schema({
    user: {type: Number, ref: "user"},
    contest: {type: Number, ref: "contest"},
    problem: {type: Number, ref: "problem"},

    problem_id: Number,
    subtask_id: Number,

    submitted_time: Number,
    judge_start_time: Number,
    judge_end_time: Number,

    // solution information
    lang: String,
    source_file: String,

    // judge result
    status: String,
    score: Number,
    case_count: Number,
    results: Object
});

Judge.index({ contest: 1, user: 1 });
Judge.index({ status: 1 });
Judge.index({ status: 1, lang: 1 });

Judge.plugin(autoIncrement.plugin, "Judge");

Judge.methods.getSourceURL = function () {
    return urljoin(SITE_URL, 'source', this.source_file);
};

Judge.methods.getSource = function () {
    try {
        var s_path = path.join(SOURCE_DIR, this.source_file);
        var source = fse.readFileSync(s_path);
        return source;
    } catch (err) {
        return err.message;
    }
};

Judge.methods.isSystem = function () {
    return this.lang == 'system_g++' || this.lang == 'system_java';
};

Judge.statics.new = function (problem, uploaded_file_path, language, user_id, contest, contest_problem_id, callback) {
    var self = this;
    if (problem.meta.supported_languages.indexOf(language) < 0) {
        return callback(new Error('Unsupported languages.'));
    }

    var suffix = {
        "pascal": ".pas",
        "gcc": ".c",
        "g++": ".cpp",
        "java": ".java",
        "system": ".zip",
        "answer": ".ans",
        "answerzip": ".zip",
        "system_g++": ".zip",
        "system_java": ".zip"
    };
    var source_file = randomstring.generate(15) + suffix[language];

    Step(function () {
        fse.move(uploaded_file_path, path.join(SOURCE_DIR, source_file), this);
    }, function (err) {
        if (err) throw err;
        var judge = new self({
            user: user_id,
            contest: contest._id,
            problem: problem._id,
            problem_id: contest_problem_id,

            // TODO: remove the concept of subtask
            subtask_id: 0,
            case_count: problem.subtasks[0].testcase_count,

            submitted_time: Date.now(),
            lang: language,
            source_file: source_file,
            score: 0,
            status: "Uploading",
            results: null
        });
        judge.save(this);
    }, function(err, j) {
        if (err) throw err;
        // The best practice recommend repopulate it than directly assign object to it.
        j.problem = problem;
        j.rejudge(this);
    }, function (err, j) {
        if (err) return callback(err);
        else return callback(null, j);
    });
};

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

            var case_score = self.problem.getCaseScore(self.subtask_id, test_id - 1);
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

Judge.methods.rejudge = function (callback) {
    this.judge_start_time = undefined;
    this.judge_end_time = undefined;
    this.status = 'Waiting';
    this.score = 0;
    this.case_count = this.problem.subtasks[0].testcase_count;
    this.results = [{
        score: 0,
        memory: 0,
        time: 0,
        status: "Waiting"
    }];
    for (var i = 0;  i < this.case_count; i++) {
        if (this.lang == 'system_g++' || this.lang == 'system_java') {
            this.results.push({
                score: 0,
                total: 0,
                correct: 0,
                time: 0
            });
        } else {
            this.results.push({
                score: 0,
                memory: 0,
                time: 0,
                status: "Waiting"
            });
        }
    }
    this.markModified('results');
    this.save(callback);
};

Judge.methods.systemProblemUpdate = function (results, callback) {
    var self = this;
    try {
        if (results.status.code != 0) {
            this.results[0] = {
                status: 'Compilation Error'
            };
        } else {
            this.results[0] = {
                status: 'Compilation Success'
            };
        }
        this.status = results.status.content;
        Object.keys(results.answers).forEach(function (test_id_str) {
            var test_id = parseInt(test_id_str) + 1;
            self.results[test_id] = {
                time: results.answers[test_id_str].time,
                total: results.answers[test_id_str].total,
                correct: results.answers[test_id_str].correct
            };
        });

        this.markModified('results');
        this.save(callback);
    } catch (err) {
        callback(err);
    }
};

module.exports = mongoose.model("judge", Judge);
