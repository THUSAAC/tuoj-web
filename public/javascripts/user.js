(function() {
	var UserCtrl = [ '$scope' , '$http' , '$timeout', function ( $scope , $http , $timeout ) {
		$scope.userlist = [];
		
		$scope.updateList = function() {
			$http.post('/api/user/', {}).then(function(res) {
				$scope.userlist = res.data.data;
				$scope.lastUpdateTime = Date.now();
			});
		}
		
		$scope.shoot = function(user) {
			$http.post('/api/notification/notification/',{ 'uid' : user._id , 'text' : user.notification}).then(function(res) {
			});
		}

		$scope.getLogout = function(_id) {
			$http.post('/api/notification/notification/',{ 'uid' : _id , 'text' : 'logout'}).then(function(res) {
			});
		}

		$scope.updateList();
	}];
	angular.module('tuoj-web',[]).controller('UserCtrl',UserCtrl);
})();
