var contestAdminCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	$scope.contest = {};
	$scope.form = {};
	$scope.titles = {};
	($scope.updateInfo = function() {
		$http.post('/api/contest/info', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.contest = data.data;
		}).catch(function(error) {
			$scope.contest = {
				title: error.data
			};
		});
		$http.post('/api/contest/content', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.problems = [];
			for (var i in data.data) {
				$scope.problems.push(data.data[i]._id);
				$scope.titles[data.data[i]._id] = data.data[i].title;
			}
		});
	})();
	$scope.removeProblem = function(i) {
		$scope.problems = $scope.problems.slice(0, i).concat($scope.problems.slice(i + 1));
	};
	$scope.swapProblem = function(i, j) {
		if ($scope.problems[i] != null && $scope.problems[j] != null) {
			var tmp = $scope.problems[i];
			$scope.problems[i] = $scope.problems[j];
			$scope.problems[j] = tmp;
		}
	};
	$scope.addProblem = function() {
		var problemId = $scope.addId || '0';
		$scope.problems.push(problemId);
		if (!$scope.titles[problemId]) {
			$http.post('/api/contest/problemTitle', {
				contestId: $scope.contestId,
				problemId: problemId
			}).then(function(data) {
				$scope.titles[problemId] = data.data.title || '题目不存在';
			});
		}
	};
	$scope.applyConfig = function() {
		$http.post('/api/contest/config', {
			contestId: $scope.contestId,
			start_time: $scope.contest.start_time._d.getTime(),
			end_time: $scope.contest.end_time._d.getTime(),
			title: $scope.contest.title,
			dashboard: $scope.contest.dashboard,
			hidden: $scope.contest.hidden || false,
			released: $scope.contest.released || false,
			published: $scope.contest.published || false,
			problems: JSON.stringify($scope.problems)
		}).then($scope.updateInfo);
	};
} ];

