var fs = require('fs');
var data = {
	title: 'Custom test',
	langs: [ {
		name: 'g++',
		exec: 'g++',
		args: '-DONLINE_JUDGE',
		maxlen: 64 * 1024,
	}, {
		name: 'g++ with std11',
		exec: 'g++',
		args: '-std=c++11 -DONLINE_JUDGE',
		maxlen: 64 * 1024,
	}, {
		name: 'gcc',
		exec: 'gcc',
		args: '-DONLINE_JUDGE',
		maxlen: 64 * 1024,
	}, {
		name: 'pascal',
		exec: 'fpc',
		args: '',
		maxlen: 64 * 1024,
	} ], cases: [ {
		ansId: 0,
		score: 100,
		inputFile: 'in',
		outputFile: 'out',
		time_limit: 5000,
		mem_limit: 512,
		spjPath: ''
	} ],
};
fs.writeFile('cus.config.default', JSON.stringify(data));
