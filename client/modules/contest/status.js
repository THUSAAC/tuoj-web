var contestStatusCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.submitCode = function() {
		if ($scope.answers.length === 0) {
			return alert('你没有选择答案文件');
		}
		var frm = {
			contestId: $scope.contestId,
			problemId: $scope.problemId,
			lang: $scope.submit.lang.name
		};
		for (var i in $scope.answers) {
			var ans = $scope.answers[i];
			frm['answer' + ans.num] = btoa(ans.code);
		}
		$http.post('/api/contest/custestcreate', frm).then(function(data) {
			$scope.answers = [];
			$scope.fetch();
		}).catch(function(error) {
			console.log(error);
			alert(error.data);
		});
	};
	($scope.fetch = function() {
		$http.post('/api/contest/status', {
			contestId: $scope.contestId,
			requestOwn: true,
			type: 'formal'
		}).then(function(data) {
			$scope.historys = data.data;
			for (var i in $scope.historys) {
				if ($scope.historys[i].status === undefined) {
					$scope.historys[i].status = 'Invisible';
				}
			}
			$scope.historys.sort(function(a, b) {
				return b.submitted_time - a.submitted_time;
			});
		}).catch(function(error) {
			console.log(error);
		});
	})();
} ];

