var config;
try {
    config = require('./config_local');
} catch (e) {
    config = require('./config')
}

module.exports = config;
