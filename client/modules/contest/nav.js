var contestNavCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', '$timeout', function($scope, $rootScope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$http.post('/api/contest/role', {
		contestId: $scope.contestId
	}).then(function(data) {
		$scope.myRole = data.data.role;
	});
	($scope.fetchCarli = function() {
		$http.post('/api/contest/carlinew', {
			contestId: $scope.contestId
		}).then(function(data) {
			if (data.data.length > 0 && !$rootScope.isRoot) {
				var info = '新消息:\n';
				for (var i in data.data) {
					info += data.data[i].from.realname + ': ' + data.data[i].text + '\n';
				}
				alert(info);
			}
			$timeout(function() {
				$scope.fetchCarli()
			}, 10000);
		}).catch(function(error) {
			console.log(error.data);
			$timeout(function() {
				$scope.fetchCarli()
			}, 10000);
		});
	})();
} ];

