var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Carli = new Schema({
	from: {
		type: Number,
		ref: 'user'
	},
	to: {
		type: Number,
		ref: 'user'
	},
	time: Number,
	text: String,
	status: String
});

Carli.plugin(autoIncrement.plugin, "carli");
module.exports = mongoose.model("carli", Carli);

