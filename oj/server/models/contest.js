var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Contest = new Schema({
    start_time: Number,
    end_time: Number,
    title: String,
	dashboard: String,
    problems: [{ type: Number, ref: "problem"}],
	released: {
		type: Boolean,
		default: false
	},
	hidden: {
		type: Boolean,
		default: false
	},
	published: {
		type: Boolean,
		default: false
	}
});
Contest.plugin(autoIncrement.plugin, "Contest");

module.exports = mongoose.model("contest", Contest);
