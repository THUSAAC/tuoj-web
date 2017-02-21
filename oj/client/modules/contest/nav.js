var contestNavCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', '$timeout', 'poll', function($scope, $rootScope, $state, $stateParams, $http, $timeout, poll) {
	$scope.contestId = $stateParams.contestId;
	$http.post('/api/contest/role', {
		contestId: $scope.contestId
	}).then(function(data) {
		$scope.myRole = data.data.role;
	});
	poll.push(($scope.fetchClari = function() {
		$http.post('/api/contest/clarinew', {
			contestId: $scope.contestId
		}).then(function(data) {
			if (data.data.length > 0 && !$rootScope.isRoot) {
				var info = '新消息:\n';
				for (var i in data.data) {
					info += data.data[i].from.realname + ': ' + data.data[i].text + '\n';
				}
				alert(info);
			}
		}).catch(function(error) {
			console.log(error.data);
		});
	}), 10, 'newClari');
} ];

