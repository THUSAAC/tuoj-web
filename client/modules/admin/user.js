var adminUserCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	$scope.generate = function() {
		$http.post('/api/admin/useradd', {
			raw: $scope.raw,
			startno: $scope.startno,
			prefix: $scope.prefix
		}).then(function(data) {
			$scope.res = data.data;
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.logoutAll = function() {
		$http.post('/api/admin/userlogoutAll');
	};
} ];

