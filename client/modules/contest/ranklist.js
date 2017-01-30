var contestRanklistCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	($scope.fetch = function() {
		$http.post('/api/contest/ranklist', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.problems = data.data.problems;
			$scope.users = data.data.list;
			$scope.users.sort(function(a, b) {
				return b.total_score - a.total_score;
			});
			if ($scope.users.length > 0) {
				$scope.users[0].rank = 1;
				for (var i = 1; i < $scope.users.length; ++ i) {
					if ($scope.users[i].total_score === $scope.users[i - 1].total_score) {
						$scope.users[i].rank = $scope.users[i - 1].rank;
					} else {
						$scope.users[i].rank = i;
					}
				}
			}
		}).catch(function(error) {
			console.log(error);
		});
	})();
} ];
