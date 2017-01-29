var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;
var path = require("path");
var fse = require("fs-extra");
var randomstring = require("randomstring");
var markdown = require("markdown").markdown;
var zipFolder = require('zip-folder');
var md5File = require('md5-file');
var urljoin = require('url-join');
var marked = require('marked');

var PROB_DIR = require("../config").PROB_DIR;
var TMP_DIR  = require("../config").TMP_DIR;
var TESTDATA_DIR = require('../config').TESTDATA_DIR;
var SITE_URL = require('../config').SITE_URL;

var Problem = new Schema({
    git_url: String,
    repo_name: String,

    title: String,
    meta: Object,

    status: String, // new problem/updating/update failed/update success

    data: String,
	description: String,
    data_md5: String,

    subtasks: Object
});
Problem.plugin(autoIncrement.plugin, "Problem");

Problem.statics.new = function(git_url, callback) {
    var p = new this();
    p.git_url = git_url;
    p.repo_name = randomstring.generate(8);
    p.title = "Waiting For Fetching";
    p.status = "New Problem";
    p.save(callback);
};

Problem.methods.getDescriptionHTML = function() {
    var description_path = path.join(this.getRepoPath(), "files", "description.md");
    var description = marked(String(fse.readFileSync(description_path)));
    return description;
};

Problem.methods.updateInfo = function(json_file, callback) {
    try {
        var info = fse.readFileSync(json_file);
        info = JSON.parse(info);

        this.title = info.title;
        this.meta = info.meta;
        this.subtasks = info.subtasks;
        this.save(callback);
    } catch(err) {
        console.warn(err);
        return callback(err);
    }
};

Problem.methods.update = function(callback) {
    this.status = "Updating";
    this.data = randomstring.generate(15) + ".zip";
	callback(false);
};

Problem.methods.getRepoPath = function() {
    return path.join(PROB_DIR, this.repo_name);
};

Problem.methods.getDataURL = function() {
    return urljoin(SITE_URL, 'test_data', this.data);
};

Problem.methods.getCaseScore = function (subtask_id, case_id) {
    var s = this.subtasks[subtask_id];
    var score = s.score / s.testcase_count;
    if (typeof(s.scores) != 'undefined') {
        try {
            score = s.scores[case_id];
        } catch (err) {
            console.error(err);
        }
    }
    return score;
};

module.exports = mongoose.model("problem", Problem);

