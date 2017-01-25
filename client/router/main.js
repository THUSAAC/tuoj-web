var homeCtrl = [ function() {
} ];
angular.module('tuoj-web', [
	'ui.router'
]).run([ 
	'$rootScope', 
	'$state', 
	'$stateParams', 
	function ($rootScope, $state, $stateParams) {
		console.log($state);
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
			// controller: homeCtrl,
			template: '<a ui-sref="test">hhh</a>'
		}).state('test', {
			url: '/test',
			template: '<p>test</p>'
		}).state('404', {});
	} 
]);
