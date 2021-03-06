var contestHomeCtrl = [ '$scope', '$rootScope', '$state', '$stateParams', '$http', 'poll', function($scope, $rootScope, $state, $stateParams, $http, poll) {
    $scope.contestId = $stateParams.contestId;
	($scope.updateIsSetter = function() {
		$http.post('/api/contest/role', {
			contestId: $scope.contestId
		}).then(function(data) {
			if (data.data.role === 'setter') $scope.isSetter = 1;
		});
	})();
	($scope.updateInfo = function() {
		$http.post('/api/contest/info', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.contest = data.data;
			$rootScope.activeContests[data.data._id] = data.data;
		}).catch(function(error) {
			$scope.contest = {
				title: error.data
			};
		});
	})();
	($scope.updateProblems = function() {
		$http.post('/api/contest/content', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.problems = data.data;
		}).catch(function(error) {
			$scope.problems = [ {
				title: 'Invisible'
			} ];
		});
	})();
} ];

