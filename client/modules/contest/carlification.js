var contestCarlificationCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	($scope.fetch = function() {
		$http.post('/api/contest/carliall', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.messages = data.data.reverse();
		}).catch(function(error) {
			console.log(error);
		});
	})();
	$scope.to = [];
	$scope.removeTo = function(i) {
		$scope.to = $scope.to.slice(0, i).concat($scope.to.slice(i + 1));
	};
	$scope.send = function() {
		var tasks = [];
		if ($scope.words.length < 1) {
			return;
		}
		if ($scope.to.length) {
			for (var i in $scope.to) {
				tasks.push($http.post('/api/contest/carlisend', {
					contestId: $scope.contestId,
					text: $scope.words,
					to: $scope.to[i]._id
				}));
			}
		} else {
			tasks.push($http.post('/api/contest/carlisend', {
				contestId: $scope.contestId,
				text: $scope.words,
			}));
		}
		Promise.all(tasks).then(function() {
			$scope.words = '';
			$scope.to = [];
			$scope.fetch();
		}).catch(function(error) {
			console.log(error.data);
		});
	};
	($scope.autoRef = function() {
		$timeout(function() {
			$scope.fetch();
			$scope.autoRef();
		}, 2048);
	})();
	$scope.checkKey = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if (keycode == 13) {  
			$scope.send();
		}
	};
} ];

