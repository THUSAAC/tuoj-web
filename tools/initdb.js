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

	var problemList = [ {
		title: 'Problem Alice',
		description: 'a',
		cases: [ {
			score: 30,
			time_limit: 400,
			mem_limit: 400,
		}, {
			score: 30,
			time_limit: 400,
			mem_limit: 400,
		}, {
			score: 40,
			time_limit: 400,
			mem_limit: 400,
		} ]
	}, {
		title: 'Problem Bob',
		description: 'b',
		cases: [ {
			score: 30,
		}, {
			score: 30,
		}, {
			score: 40,
		} ]
	} ];
	problemList.forEach(function(d) {
		var mod = new Problem(d);
		mod.save(function (err, u) {
			if (err) return console.error(err);
			else console.log(u);
		});
	});

	var userList = [{
		username: 'root',
		password: 'root',
		realname: '管理员',
		school: '清华大学',
	}, {
		username: 'player0',
		password: 'player',
		realname: '钟皓曦',
		school: '清华大学',
	}, {
		username: 'player1',
		password: 'player',
		realname: '钟妹',
		school: '你猜大学',
	}, {
		username: 'player2',
		password: 'player',
		realname: '赵汉卿',
		school: '野鸡大学',
	}, {
		username: 'staff0',
		password: 'tktkddd',
		realname: '出题人',
		school: '北京大学',
	}];

	userList.forEach(function(userInfo) {
		var user = new User(userInfo);
		user.save(function (err, u) {
			if (err) return console.error(err);
			else console.log(u);
		});
	});

	var d = new Date;

	var contestList = [ {
		start_time: 485655200000,
		end_time: 485691200000,
		title: 'Test Round 0',
		dashboard: 'Ended contest',
		problems: [ 0, 1 ]
	}, {
		start_time: 1407655200000,
		end_time: 1499691200000,
		title: 'Test Round 1',
		dashboard: 'Runing contest',
		problems: [ 0, 1 ]
	}, {
		start_time: 2487655200000,
		end_time: 2487691200000,
		title: 'Test Round 2',
		dashboard: 'Unstarted contest',
		problems: [ 0, 1 ]
	} ];

	contestList.forEach(function(userInfo) {
		var user = new Contest(userInfo);
		user.save(function (err, u) {
			if (err) return console.error(err);
			else console.log(u);
		});
	});

	var roleList = [ {
		user: 0,
		contest: 0,
		role: 'player'
	}, {
		user: 0,
		contest: 1,
		role: 'player'
	}, {
		user: 0,
		contest: 2,
		role: 'player'
	}, {
		user: 1,
		contest: 0,
		role: 'master'
	}, {
		user: 1,
		contest: 1,
		role: 'master'
	}, {
		user: 1,
		contest: 2,
		role: 'master'
	}, ];

	roleList.forEach(function(d) {
		var role = new Role(d);
		role.save(function (err, u) {
			if (err) return console.error(err);
			else console.log(u);
		});
	});

})();
