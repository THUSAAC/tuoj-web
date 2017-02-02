var adminStatusCtrl = [ '$scope', '$http', '$timeout', 'poll', function($scope, $http, $timeout, poll) {
	var emptyFilter = function() {
		var res = undefined;
		for (var i in $scope.filter) {
			res = res || $scope.filter[i];
		}
		return res === undefined;
	};
	var updateList = function(res) {
		if (res.data) {
			$scope.list = res.data.reverse();
		}
		$scope.lastUpdateTime = Date.now();
	};
	$scope.filter = {};
	$scope.list = [];
	($scope.updateList = function() {
		for (var i in $scope.filter) {
			if ($scope.filter[i] === '') {
				$scope.filter[i] = undefined;
			}
		}
		$http.post('/api/admin/status', { queryAttr: JSON.stringify($scope.filter) }).then(updateList);
	})();
	$scope.rejudgeList = function() {
		$http.post('/api/admin/rejudge', $scope.filter);
	};
	$scope.rejudge = function(_id) {
		$http.post('/api/admin/rejudge', { _id: _id });
		$scope.updateList();
	};
	poll.push(function() {
		if ($scope.autoref) {
			$scope.updateList();
		}
	}, 2000, 'autoRef');
} ]; 

