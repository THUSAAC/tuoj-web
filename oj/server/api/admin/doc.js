var fs = require('fs-extra');
var path = require('path');

module.exports.update = function(req, res, next) {
	if (req.body.text == null || req.body.id == null) {
		return res.status(400).send('Wrong query');
	}
	var filePath = path.resolve(__dirname, '../../../staticdata', req.body.id + '.doc.static');
	console.log(filePath);
	fs.writeFile(filePath, req.body.text, 'utf-8', function(error) {
		if (error) {
			return res.status(500).send('Writing error');
		}
		res.status(200).send('Done');
	});
};
