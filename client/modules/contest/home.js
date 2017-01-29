var contestHomeCtrl = [ '$scope', '$state', '$stateParams', '$http', function($scope, $state, $stateParams, $http) {
    $scope.contestId = $stateParams.contestId;
	($scope.updateInfo = function() {
		$http.post('/api/contest/info', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.contest = data.data;
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
