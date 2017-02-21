var mongoose = require('mongoose')
var autoIncrement = require("mongoose-auto-increment")
mongoose.connect('mongodb://127.0.0.1/tuoj')
autoIncrement.initialize(mongoose.connection); 
setTimeout(function() {
	mongoose.disconnect();
}, 3000);
(function() {
	var Contest = require('../server/models/contest');
	var Role = require('../server/models/role'); 
	var User=require('../server/models/user');
	var Problem = require('../server/models/problem');
	var Judge = require('../server/models/judge');
	Judge.findOneAndUpdate({
		type: 'cus'
	}, {
		type: 'cus'
	}, {
		sort: {
			_id: 1
		}
	}).exec(function(error, doc) {
		console.log(doc);
	});
})();
