var mongoose = require('mongoose')
var autoIncrement = require("mongoose-auto-increment")
mongoose.connect('mongodb://127.0.0.1/tuoj')
autoIncrement.initialize(mongoose.connection);
var User=require('../models/user')

var userList = [{
	username: 'root',
	password: 'root',
	realname: '管理员',
	school: 'Tsinghua U.',
	is_admin: 1
}, {
	username: 'player0',
	password: 'player',
	realname: '钟皓曦',
	school: '清华大学.',
}, {
	username: 'player1',
	password: 'player',
	realname: '钟皓曦的女朋友',
	school: '你猜大学',
}, {
	username: 'player2',
	password: 'player',
	realname: '赵汉卿',
	school: '野鸡大学',
}];

var cnt = 0;
userList.forEach(function(userInfo) {
    var user = new User(userInfo);
    user.save(function (err, u) {
        if (++ cnt === userList.length) {
            mongoose.disconnect();
        }
        if (err) return console.error(err);
        else console.log(u);
    });
});

