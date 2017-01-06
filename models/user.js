var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var User = new Schema({
    username: {type: String, unique: true},
	realname: String,
	school: String,
    password: String,
	email: String,
	notification: String,
    is_admin: {type: Boolean, default: false},
	is_staff: {type: Boolean, default: false}
});
User.plugin(autoIncrement.plugin, "User");

User.methods.validate_info = function (callback) {
	// TODO: validate the username and the email;

	return callback();
};

module.exports = mongoose.model("user", User);
