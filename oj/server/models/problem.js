var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;
var randomstring = require("randomstring");

var Problem = new Schema({
    title: String,
	local: String,
    langs: Object,
	cases: Object,
    data: String,
	dataMD5: String,
	description: String,
});

Problem.plugin(autoIncrement.plugin, "Problem");
module.exports = mongoose.model("problem", Problem);

