var path = require("path");
var multer  = require('multer');

var baseDir = path.resolve(__dirname, '..');

config = {
	BASE_DIR: baseDir,
    DATA_DIR: path.resolve(baseDir, "data"),
    PROB_DIR: path.resolve(baseDir, "data", "problems"),
    USER_SOL_DIR: path.resolve(baseDir, "data", "user_solutions"),
    TMP_DIR: path.resolve(baseDir, "data", "tmp"),
    SOURCE_DIR: path.resolve(baseDir, 'public', 'source'),
    TESTDATA_DIR: path.resolve(baseDir, 'public', 'test_data'),
    SITE_URL: 'https://ccsp.cspro.org',
    TOKEN: 'faf3ar42q34',

    EXPRESS_SESSION: {
        secret:'grejpomvit98c39cmjrfasdolc',
        cookie:{maxAge:1000*60*60*24*30},
        resave: true,
        saveUninitialized: false
    },

    MULTER_UPLOAD: multer({dest: path.resolve(baseDir, "data", "tmp", "uploads"), limits: {fileSize: 10 * 1024 * 1024}})
};

module.exports = config;
