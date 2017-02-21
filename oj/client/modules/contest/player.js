var contestPlayerCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	($scope.loadUsers = function() {
		$http.post('/api/contest/players', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.players = data.data;
		}).catch(function(error) {
			console.log(error);
		});
		$http.post('/api/contest/delays', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.delays = data.data;
		}).catch(function(error) {
			console.log(error);
		});
	})();
	$scope.applyQuery = function(username, userId, role) {
		$http.post('/api/contest/modifyRole', {
			contestId: $scope.contestId,
			username: username, 
			userId: userId,
			role: role
		}).catch(function(error) {
			alert('Error modifing ' + username + ':\n' + error.data);
		});
	};
	$scope.addPlayer = function() {
		$scope.applyQuery($scope.addUserId, undefined, 'player');
		$timeout($scope.loadUsers, 100);
	};
	$scope.changeRole = function(player) {
		$scope.applyQuery(undefined, player.user._id, player.role);
		$timeout($scope.loadUsers, 100);
	};
	$scope.removeRole = function(player) {
		$scope.applyQuery(undefined, player.user._id, 'none');
		$timeout($scope.loadUsers, 100);
	};
	$scope.batchAdd = function() {
		var users = $scope.batchInput.split('\n');
		for (var i in users) {
			var username = users[i];
			if (typeof(username) === 'string' && username.match(/^\w*$/) !== null) {
				$scope.applyQuery(username, undefined, 'player');
			}
		}
		$timeout($scope.loadUsers, 100);
	}
	$scope.addDelay = function() {
		$http.post('/api/contest/delayupdate', {
			contestId: $scope.contestId,
			value: $scope.addDelayVal,
			username: $scope.addDelayUsername
		}).then(function() {
			$scope.loadUsers();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.changeDelay = function(d) {
		$http.post('/api/contest/delayupdate', {
			contestId: $scope.contestId,
			value: d.value,
			userId: d.user._id
		}).then(function() {
			$scope.loadUsers();
		}).catch(function(error) {
			alert(error.data);
		});
	};
} ];


