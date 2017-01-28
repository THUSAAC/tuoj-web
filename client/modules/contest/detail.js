var contestDetailCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.rec =  {
		problem: { title: 'a', id: 1 },
		lang: 'g++',
		status: 'Pending',
		time: Date.now(),
		username: 'zbonghaoxi',
		answers: [ {
			langClass: 'cpp',
			code: '#include <cstdio>\n\nint main() {\n	puts("Hello world\\n");\n}'
		} ],
		cases: [ {
			time: 10, mem: 120, score: 30, status: 'Accepted'
		}, {
			time: 1100, mem: 1233200, score: 0, status: 'Time Limit Exceeded', extInfo: 'naiiive'
		}, {
			status: 'Pending'
		} ]
	};
	$timeout(hljs.initHighlighting, 100);
	$scope.fetch = function() {
	};
} ];
