var mainCtrl = [ '$scope', '$http', function($scope, $http) {
	$scope.login = {
		username: '',
		password: ''
	};
	$scope.authLogin = function() {
	};
} ];

angular.module('tuoj-web', [
	'ui.router'
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
			controller: contestProblemCtrl
		}).state('user', {
			url: '/user',
			abstract: true
		}).state('user.login', {
			url: '/login',
			template: '<p>login</p>'
		}).state('404', {});
	} 
]).controller('mainCtrl', mainCtrl);
