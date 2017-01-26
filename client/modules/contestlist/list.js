var contestListCtrl = [ '$scope', '$state', '$http', function($scope, $state, $http) {
	$scope.list = [
		{
			id: '1',
			title: 'Contest 1',
			beginTime: Date.now()
		}
	];
} ];
