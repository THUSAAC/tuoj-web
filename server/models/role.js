var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Role = new Schema({
	user: {
		type: Number,
		ref: 'user'
	}, contest: { 
		type: Number, 
		ref: 'contest' 
	}, role: String
});

Role.plugin(autoIncrement.plugin, "Role");
module.exports = mongoose.model("role", Role);
