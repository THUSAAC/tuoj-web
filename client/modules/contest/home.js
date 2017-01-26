var contestHomeCtrl = [ '$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
	$scope.contest = {
		title: 'Test ' + $stateParams.contestId,
        problems: [ 'a', 'b' ],
	};
    $scope.contestId = $stateParams.contestId;
} ];
