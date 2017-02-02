var fs = require('fs');
var data = {
	title: 'Custom test',
	langs: [ {
		name: 'g++',
		exec: 'g++',
		args: '-DONLINE_JUDGE'
	}, {
		name: 'g++ with std11',
		exec: 'g++',
		args: '-std=c++11 -DONLINE_JUDGE'
	}, {
		name: 'gcc',
		exec: 'gcc',
		args: '-DONLINE_JUDGE'
	}, {
		name: 'pascal',
		exec: 'fpc',
		args: ''
	} ], cases: [ {
		ansId: 1,
		score: 100,
		inputFile: 'in',
		outputFile: 'out',
		time_limit: 5000,
		mem_limit: 512
	} ],
};
fs.writeFile('cus.config', JSON.stringify(data));
