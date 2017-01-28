var contestRanklistCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.problems = [ {
		title: 'a', id: '1'
	}, {
		title: 'b', id: '2'
	} ];
	$scope.users = [ {
		username: 'zbonghaoxi',
		school: 'CDQZ',
		realname: 'misaka',
		totalScore: 170,
		score: [ 100, 70 ],
		runId: [ 1, 2 ]
	} ];
	$scope.fetch = function() {
	};
} ];
