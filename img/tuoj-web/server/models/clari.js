var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Clari = new Schema({
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

Clari.plugin(autoIncrement.plugin, "clari");
module.exports = mongoose.model("clari", Clari);

