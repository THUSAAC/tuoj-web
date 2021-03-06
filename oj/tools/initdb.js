var mongoose = require('mongoose')
var autoIncrement = require("mongoose-auto-increment")
var dbURL = 'mongodb://127.0.0.1/tuoj';
if (process.env.DBURL) {
	dbURL = process.env.DBURL;
}
mongoose.connect(dbURL);
autoIncrement.initialize(mongoose.connection); 
setTimeout(function() {
	mongoose.disconnect();
}, 3000);
(function() {
	var Contest = require('../server/models/contest');
	var Role = require('../server/models/role'); 
	var User=require('../server/models/user');
	var Problem = require('../server/models/problem');

	var userList = [{
		username: 'root',
		password: 'root',
		realname: '管理员',
		school: '清华大学',
	}];

	userList.forEach(function(userInfo) {
		var user = new User(userInfo);
		user.save(function (err, u) {
			if (err) return console.error(err);
			else console.log(u);
		});
	});
	
	var role = new Role({
		user: 0,
		contest: -1,
		role: 'root'
	});
	role.save(function(err, u) {
		if (err) return console.error(err);
		else console.log(u);
	});
})();
