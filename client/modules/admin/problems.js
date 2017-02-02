var adminProblemsCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	($scope.updateList = function() {
		$http.post('/api/admin/problemlist').then(function(data) {
			$scope.problems = data.data.reverse();
		});
	})();
	$scope.showCustests = false;
	$scope.addProblem = function() {
		$http.post('/api/admin/problemcreate').then(function(data) {
			$scope.updateList();
		}).catch(function(error) {
			alert(error);
		});
	};
} ];

