var router = require('express').Router();
var fs = require('fs');
var path = require('path');
fs.readdir(__dirname, function(error, doc) {
    doc.forEach(function(id) {
        if (id.match(/index/) !== null) {
            return;
        }
        if (id.match(/^\w*$/) !== null) {
            var moduleName = id;
			try {
				fs.readFileSync(path.resolve(__dirname, id, 'index.js'));
			} catch (error) {
				return;
			}
            router.use('/' + moduleName, require('./' + moduleName));
            console.log('API module ' + moduleName + ' loaded');
        }
    });
});
module.exports = router;
