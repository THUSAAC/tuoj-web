var contestNavCtrl = [ '$scope', '$state', '$stateParams','$http', function($scope, $state, $stateParams, $http) {
	$scope.contestId = $stateParams.contestId;
	$http.post('/api/contest/role', {
		contestId: $scope.contestId
	}).then(function(data) {
		$scope.myRole = data.data.role;
	});
} ];
