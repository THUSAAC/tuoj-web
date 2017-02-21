var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var User = new Schema({
	username: {
		type: String, 
		unique: true
	},
	realname: String,
	school: String,
	password: String,
	email: String,
});

User.plugin(autoIncrement.plugin, "Users");

module.exports = mongoose.model("user", User);
