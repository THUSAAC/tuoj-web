var contestListCtrl = [ '$scope', '$state', '$http', '$timeout', function($scope, $state, $http, $timeout) {
	$scope.list = [];
	($scope.updateList = function() {
		$http.post('/api/contest/list').then(function(data) {
			$scope.list = [];
			for (var i in data.data) {
				$scope.updateContest(data.data[i].contest, data.data[i].role);
			}
		}).catch(function(error) {
		});
	})();
	$scope.updateContest = function(contestId, role) {
		$http.post('/api/contest/info', {
			contestId: contestId
		}).then(function(data) {
			data.data.role = role;
			$scope.list.push(data.data);
		}).catch(function(error) {
			console.log(error);
		});
	};
} ];
