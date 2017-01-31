var path = require('path');
var fs = require('fs-extra');

var enumDir = function(rootPath, curDir, prefix) {
	if (prefix == null) {
		prefix = '';
	}
	if (curDir == null) {
		curDir = '/';
	}
	var res = prefix + curDir + '\n';
	for (var i = 1; i < curDir.length; ++ i) {
		prefix += ' ';
	}
	prefix += '|';
	try {
		var list = fs.readdirSync(rootPath);
		list.forEach(function(sub) {
			if (res.length > 1000) {
				res += prefix + '...\n';
				return;
			}
			if (typeof(sub) === 'string' && sub.match(/^\./) === null) {
				res += enumDir(path.join(rootPath, sub), sub, prefix);
			}
		});
		return res;
	} catch (error) {
		return res;
	}
} 
module.exports.enumDir = enumDir;
