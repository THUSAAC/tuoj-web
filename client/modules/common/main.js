var mainCtrl = [ '$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
	$rootScope.login = {
		username: '',
		password: ''
	};
	$rootScope.user = {};
	$rootScope.authLogin = function() {
		$http.post('/api/user/login', $rootScope.login).then(function(data) {
			$rootScope.username = $rootScope.login.username;
			$rootScope.loadUserInfo();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$rootScope.loadUserInfo = function() {
		$http.post('/api/user/lookup').then(function(data) {
			$rootScope.username = data.data.realname || data.data.username;
		}).catch(function(error) {
			$rootScope.username = null;
		});
	};
	$rootScope.loadUserInfo();
	$rootScope.authLogout = function() {
		$http.post('/api/user/logout').then(function(data) {
			$rootScope.loadUserInfo();
		}).catch(function(error) {
			$rootScope.loadUserInfo();
		});
	};
	($rootScope.updateTime = function() {
		$http.post('/api/user/time').then(function(data) {
			$rootScope.servertime = data.data.time;
			$timeout(function() {
				$rootScope.updateTime();
			}, 1000);
		}).catch(function(error) {
			$timeout($rootScope.updateTime, 12000);
		});
	})();
} ];

