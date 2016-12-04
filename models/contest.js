var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var Contest = new Schema({
    start_time: Number,
    end_time: Number,
    name: String,
	released: {
		type: Boolean,
		default: false
	},
	dashboard: String,
    problems: [{ type: Number, ref: "problem"}],
	hidden: {
		type: Boolean,
		default: false
	}
});
Contest.plugin(autoIncrement.plugin, "Contest");

Contest.methods.is_frozen = function () {
    var remain = this.end_time - Date.now();
    return remain < 2*60*60*1000 && (remain > 0 || !this.released);
};

Contest.methods.get_status = function (delay) {
    var now = Date.now();
    var offset = 0;
    if (delay !== undefined) {
        offset = delay * 60 * 1000;
    }
    if (now < this.start_time) {
        return 'unstarted';
    } else if (now > this.end_time + offset) {
        return 'ended';
    } else {
        return 'in_progress';
    }
};

module.exports = mongoose.model("contest", Contest);
