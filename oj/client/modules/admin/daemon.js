var adminDaemonCtrl = [ '$scope', '$http', '$timeout', 'poll', function($scope, $http, $timeout, poll) {
	var updateList = function(res) {
		if (res.data) {
			$scope.list = [];
			for (var i in res.data) {
				$scope.list.push({
					ip: i,
					time: res.data[i]
				});
			}
		}
		$scope.lastUpdateTime = Date.now();
	};
	$scope.list = [];
	($scope.updateList = function() {
		for (var i in $scope.filter) {
			if ($scope.filter[i] === '') {
				$scope.filter[i] = undefined;
			}
		}
		$http.post('/api/admin/judgers').then(updateList).catch(function(error) {
			alert(error.data);
		});
	})();
	poll.push(function() {
		$scope.updateList();
	}, 2, 'autoRefDaemon');
} ]; 

