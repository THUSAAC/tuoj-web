var contestDetailCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.runId = $stateParams.runId;
	$timeout(hljs.initHighlighting, 100);
	($scope.fetch = function() {
		$http.post('/api/contest/status', {
			contestId: $scope.contestId,
			runId: $scope.runId,
			requestAnswer: true
		}).then(function(data) {
			$scope.rec = data.data[0];
			if (!$scope.rec.status) {
				$scope.rec.status = 'Invisible';
			}
			$scope.answers = [];
			$http.get('/staticdata/' + $scope.rec.source_file).then(function(code) {
				$scope.answers.push({
					lang: $scope.rec.lang,
					code: code.data
				});
				$timeout(hljs.initHighlighting, 100);
			});
		}).catch(function(error) {
			console.log(error);
		});
		$http.post('/api/contest/cases', {
			contestId: $scope.contestId,
			runId: $scope.runId,
		}).then(function(data) {
			$scope.cases = data.data;
			$scope.cases.sort(function(a, b) {
				return a.caseId - b.caseId;
			});
		}).catch(function(error) {
			console.log(error);
		});
	})();
} ];

