var path = require("path");

var baseDir = path.resolve(__dirname, '../..');

module.exports = {
    EXPRESS_SESSION: {
        secret:'grejpomvit98c39cmjrfasdolc',
        cookie: {
			maxAge: 1000*60*60*24*30
		},
        resave: true,
        saveUninitialized: false
    },
	judgerToken: 'far',
	siteURL: 'http://' + (process.env.ADDR || 'localhost') + ':' + (process.env.PORT || '3333')
};
