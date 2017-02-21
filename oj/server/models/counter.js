var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Counter = new Schema({
	
});

Custest.plugin(autoIncrement.plugin, "Custest");

module.exports = mongoose.model("custest", Custest);
