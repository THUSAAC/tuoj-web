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
			for (var i in $scope.rec.source_file) {
				(function(i) {
					$http.get('/staticdata/' + $scope.rec.source_file[i]).then(function(code) {
						$scope.answers.push({
							lang: $scope.rec.lang,
							code: code.data,
							num: i
						});
						(function(id) {
							$timeout(function() {
								try {
									hljs.highlightBlock(document.getElementById(id));
								} catch (error) {
								}
							}, 100);
						})('code' + i);
					});
				})(i);
			}
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

