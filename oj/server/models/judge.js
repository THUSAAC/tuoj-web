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
	status: String,
	type: String, // formal or cus
});

Judge.index({ contest: 1, user: 1 });
Judge.index({ status: 1 });
Judge.index({ status: 1, lang: 1 });

Judge.plugin(autoIncrement.plugin, "Judge");
module.exports = mongoose.model("judge", Judge);
