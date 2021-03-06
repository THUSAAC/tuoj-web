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
		}).state('contest.custest', {
			url: '/custest',
			templateUrl: '/modules/contest/custest.html',
			controller: contestCustestCtrl
		}).state('contest.problem', {
			url: '/problem/:problemId',
			templateUrl: '/modules/contest/problem.html',
			controller: contestProblemCtrl,
			resolve: {
				onLoad: [ '$ocLazyLoad', function($ocLazyLoad) { 
					return $ocLazyLoad.load([ {
						name: 'MathJax',
						files: [ '/bower_components/MathJax/MathJax.js?config=default' ]
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
		}).state('contest.clarification', {
			url: '/clarification',
			templateUrl: '/modules/contest/clarification.html',
			controller: contestClarificationCtrl,
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
			params: {
				contestId: undefined,
				problemId: undefined,
			},
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
		}).state('admin.status', {
			url: '/status',
			templateUrl: '/modules/admin/status.html',
			controller: adminStatusCtrl,
		}).state('admin.daemon', {
			url: '/daemon',
			templateUrl: '/modules/admin/daemon.html',
			controller: adminDaemonCtrl,
		}).state('admin.user', {
			url: '/user',
			templateUrl: '/modules/admin/user.html',
			controller: adminUserCtrl,
		}).state('admin.doc', {
			url: '/doc',
			templateUrl: '/modules/admin/doc.html',
			controller: adminDocCtrl,
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
		}).state('doc', {
			url: '/doc/:docId',
			templateUrl: '/modules/doc/view.html',
			controller: docViewCtrl,
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
			"System Error": "danger",
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
			"viewer": "观察者",
			"setter": "可爱的出题人",
			"home": "首页",
			"contestlist": "比赛列表",
			"contestlist.my": "我的比赛",
			"contest": "比赛",
			"contest.home": "比赛信息",
			"contest.problem": "查看题目",
			"contest.status": "比赛记录",
			"contest.ranklist": "比赛排行榜",
			"contest.detail": "答案详情",
			"contest.admin": "比赛设置",
			"contest.player": "选手设置",
			"contest.clarification": "消息",
			"contest.custest": "自定义测试",
			"admin": "全局配置",
			"admin.problems": "题目池",
			"admin.problem": "编辑题目",
			"admin.status": "评测队列",
			"admin.doc": "编辑文档",
			"admin.daemon": "评测机监控",
			"admin.user": "用户管理",
			"doc": "文档",
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
}).filter('invisibleFilter', function() {
	return function(data) {
		if (data == null) {
			return 'Invisible';
		}
		return data;
	};
}).filter('preview', function() {
	return function(data, filename) {
		if (typeof(filename) === 'string' && filename.match(/pas$|c$|cpp$/) !== null) {
			return data;
		} else {
			var rollLines = function(data) {
				var lines = data.split('\n');
				if (lines.length < 4) {
					return data;
				} else {
					var last = lines.length - 1;
					while (last > 3 && lines[last] === '') {
						-- last;
					}
					return [ lines[0], lines[1], lines[2], '...', lines[last] ].join('\n');
				}
			};
			var rollLine = function(data) {
				var lines = data.split('\n');
				var res = [];
				for (var i in lines) {
					if (lines[i].length < 40) {
						res.push(lines[i]);
					} else {
						res.push(lines[i].substr(0, 16) + '...' + lines[i].substr(-16));
					}
				}
				return res.join('\n');
			};
			return rollLine(rollLines(data));
		}
	};
}).factory('poll', pollSrv).factory('mjLoader', mjLoaderSrv);
