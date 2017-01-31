angular.module('tuoj-web', [
	'ui.router',
	'oc.lazyLoad',
	'ae-datetimepicker'
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
			templateUrl: '/modules/contest/nav.html',
			controller: contestNavCtrl,
			abstract: true
		}).state('contest.home', {
			url: '/home',
			templateUrl: '/modules/contest/home.html',
			controller: contestHomeCtrl
		}).state('contest.problem', {
			url: '/problem/:problemId',
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
		}).state('contest.status', {
			url: '/status',
			templateUrl: '/modules/contest/status.html',
			controller: contestStatusCtrl,
		}).state('contest.ranklist', {
			url: '/ranklist',
			templateUrl: '/modules/contest/ranklist.html',
			controller: contestRanklistCtrl,
		}).state('contest.detail', {
			url: '/detail/:runId',
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
		}).state('contest.admin', {
			url: '/admin',
			templateUrl: '/modules/contest/admin.html',
			controller: contestAdminCtrl,
		}).state('contest.player', {
			url: '/player',
			templateUrl: '/modules/contest/player.html',
			controller: contestPlayerCtrl,

		}).state('admin', {
			url: '/admin',
			templateUrl: '/modules/admin/nav.html',
			controller: adminNavCtrl,
		}).state('admin.problems', {
			url: '/problems',
			templateUrl: '/modules/admin/problems.html',
			controller: adminProblemsCtrl,
		}).state('admin.problem', {
			url: '/problem/:problemId',
			templateUrl: '/modules/admin/problem.html',
			controller: adminProblemCtrl,

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
			"Invisible": "info",
			"unstarted": "warning",
			"in_progress": "success",
			"ended": "info",
		};
		return map[str] ? map[str] : 'warning';
	};
}).filter('ojTranslate', function() {
	return function(str) {
		var map = {
			"unstarted": "未开始",
			"in_progress": "进行中",
			"ended": "已结束",
			"master": "管理员",
			"viewer": "观察者"
		};
		return map[str] ? map[str] : '未知';
	};
}).filter('langClass', function() {
	return function(input) {
		var str = input;
		if (typeof(str) !== 'string') {
			return 'plain';
		}
		if (str.match(/g\+\+/) !== null) {
			return 'cpp';
		} else if (str.match(/gcc/) !== null) {
			return 'c';
		} else if (str.match(/pascal/) !== null) {
			return 'pascal';
		}
		return 'plain';
	};
});
