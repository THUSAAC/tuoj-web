var contestStatusCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.historys = [ {
		id: 2,
		problem: { title: 'a', id: 1 },
		lang: 'g++',
		status: 'Pending',
		time: Date.now(),
		username: 'zbonghaoxi'
	}, {
		id: 1,
		problem: { title: 'a', id: 1 },
		lang: 'g++',
		status: 'Accepted',
		score: 100,
		time: Date.now(),
		username: 'zbonghaoxi'
	} ];
	$scope.fetch = function() {
		$scope.historys = $scope.historys;
	};
} ];
