var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Case = new Schema({
	judge: {
		type: Number,
		ref: 'judge'
	},
	caseId: Number,
	score: Number, // in [0, fullScore]
	fullScore: Number,
	status: String,
	time: String,
	memory: String,
	finishedTime: String
});

Case.plugin(autoIncrement.plugin, "case");
module.exports = mongoose.model("case", Case);
