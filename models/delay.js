var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Delay = new mongoose.Schema({
	user: { type: Number, ref: 'user' },
	contest: { type: Number, ref: 'contest' },
	value: Number
});
Delay.plugin(autoIncrement.plugin, "Delay");

module.exports = mongoose.model('delay', Delay);
