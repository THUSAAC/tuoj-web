var path = require("path");

var baseDir = path.resolve(__dirname, '../..');

module.exports = {
	BASE_DIR: baseDir,
    DATA_DIR: path.resolve(baseDir, "data"),
    PROB_DIR: path.resolve(baseDir, "data", "problems"),
    USER_SOL_DIR: path.resolve(baseDir, "data", "user_solutions"),
    TMP_DIR: path.resolve(baseDir, "data", "tmp"),
    SOURCE_DIR: path.resolve(baseDir, 'data', 'source'),
    TESTDATA_DIR: path.resolve(baseDir, 'data', 'pack'),
    SITE_URL: 'localhost:3333',
    TOKEN: 'faf3ar42q34',

    EXPRESS_SESSION: {
        secret:'grejpomvit98c39cmjrfasdolc',
        cookie: {
			maxAge: 1000*60*60*24*30
		},
        resave: true,
        saveUninitialized: false
    }
};

