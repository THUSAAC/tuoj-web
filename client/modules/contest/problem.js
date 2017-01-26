var contestProblemCtrl = [ '$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
	$scope.problem = {
		title: 'problem ' + $stateParams.problemId,
	};
} ];
