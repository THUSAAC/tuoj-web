var mainCtrl = [ '$scope', '$http', function($scope, $http) {
	$scope.login = {
		username: '',
		password: ''
	};
	$scope.authLogin = function() {
	};
} ];

angular.module('tuoj-web', [
	'ui.router',
	'oc.lazyLoad'
]).run([ 
	'$rootScope', 
	'$state', 
	'$stateParams', 
	function($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	} 
]).config([ 
	'$stateProvider', 
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('home', {
			url: '/',
			templateUrl: '/modules/home/home.html'
		}).state('test', {
			url: '/test',
			templateUrl: '/modules/contestlist/list.html',
		}).state('contestlist', {
			url: '/contestlist',
			controller: contestListCtrl,
			templateUrl: '/modules/contestlist/list.html',
			abstract: true 
		}).state('contestlist.my', {
			url: '/my',
			templateUrl: '/modules/contestlist/list.html',
			controller: contestListCtrl,
		}).state('contest', {
			url: '/contest/:contestId',
			templateUrl: '/modules/contest/home.html',
			controller: contestHomeCtrl
		}).state('contestproblem', {
			url: '/contest/:contestId/problem/:problemId',
			templateUrl: '/modules/contest/problem.html',
			controller: contestProblemCtrl,
			resolve: {
				onLoad: [ '$ocLazyLoad', function($ocLazyLoad) { 
					return $ocLazyLoad.load([ {
						name: 'MathJax',
						files: [ '/bower_components/MathJax/MathJax.js?config=TeX-AMS_HTML' ]
					}, {
						name: 'showdown',
						files: [ '/bower_components/showdown/dist/showdown.min.js' ]
					} ]);
				} ]
			}
		}).state('conteststatus', {
			url: '/contest/:contestId/status',
			templateUrl: '/modules/contest/status.html',
			controller: contestStatusCtrl,
		}).state('contestranklist', {
			url: '/contest/:contestId/ranklist',
			templateUrl: '/modules/contest/ranklist.html',
			controller: contestRanklistCtrl,
		}).state('contestdetail', {
			url: '/contest/:contestId/detail/:runId',
			templateUrl: '/modules/contest/detail.html',
			controller: contestDetailCtrl,
			resolve: {
				onLoad: [ '$ocLazyLoad', function($ocLazyLoad) { 
					return $ocLazyLoad.load([ {
						name: 'highlightjs',
						files: [ '/bower_components/highlightjs/highlight.pack.min.js' ]
					} ]);
				} ]
			}

		}).state('user', {
			url: '/user',
			abstract: true
		}).state('user.login', {
			url: '/login',
			template: '<p>login</p>'
		}).state('404', {});
	} 
]).controller('mainCtrl', mainCtrl).filter('statusClass', function() {
	return function(str) {
		var map = {
			"Accepted": "success",
			"Wrong Answer": "danger",
			"Time Limit Exceeded": "warning",
			"Memory Limit Exceeded": "warning",
			"Runtime Error": "warning",
			"Compilation Error": "primary",
			"No Source": "primary",
			"Dangerous Program": "danger",
			"Waiting": "info",
			"Running": "info",
			"Compilation Success": "info",
			"Running success": "success",
			"Compile error": "primary",
			"Running timeout": "warning",
			"Running error": "warning",
			"Invisible": "info" 
		};
		return map[str] ? map[str] : 'info';
	};
});
