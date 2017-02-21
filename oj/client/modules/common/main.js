var mainCtrl = [ '$scope', '$rootScope', '$http', '$timeout', 'poll', function($scope, $rootScope, $http, $timeout, poll) {
	$rootScope.login = {
		username: '',
		password: ''
	};
	$rootScope.leftWid = 8;
	$rootScope.rightWid = 4;
	$rootScope.changeLR = function() {
		$rootScope.leftWid ^= (8 ^ 12);
		$rootScope.rightWid ^= (4 ^ 12);
	};
	$rootScope.activeContests = {};
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
			if (typeof(data.data) === 'object') {
				$rootScope.currentUser = data.data;
			} else {
				$rootScope.currentUser = null;
			}
		}).catch(function(error) {
			$rootScope.currentUser = null;
		});
		$http.post('/api/user/isroot').then(function(data) {
			$rootScope.isRoot = data.data.isRoot;
		}).catch(function(error) {
			$rootScope.isRoot = false;
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
	poll.push(function() {
		$http.post('/api/user/time').then(function(data) {
			$rootScope.servertime = data.data.time;
		});
	}, 30, 'updateTime');
	poll.push(function() {
		$rootScope.servertime += 1000;
	}, 1, 'incTime');
} ];

