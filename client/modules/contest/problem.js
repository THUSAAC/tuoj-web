var contestProblemCtrl = [ '$scope', '$rootScope', '$state', '$stateParams', '$http', '$timeout', 'mjLoader', function($scope, $rootScope, $state, $stateParams, $http, $timeout, mjLoader) {
	mjLoader.init();
	$scope.contestId = $stateParams.contestId;
	$scope.problemId = $stateParams.problemId;
	$scope.problem = {
		maxAns: 1
	};
	$scope.renderDescription = function(content) {
		mjLoader.render(content, '#problemtext');
	};
	$scope.fetchData = function() {
		$http.get('/staticdata/' + $scope.problem.token + '.description').then(function(data) {
			$scope.renderDescription(data.data);
			$scope.needReload = false;
		}).catch(function(data) {
			$scope.needReload = true;
		});
		$http.get('/staticdata/' + $scope.problem.token + '.config').then(function(data) {
			$scope.langs = data.data.langs;
			$scope.submit.lang = $scope.langs[0];
			$scope.cases = data.data.cases;
			$scope.problem.maxAns = 0;
			for (var i in $scope.cases) {
				var tId = parseInt($scope.cases[i].ansId);
				if ($scope.problem.maxAns < tId) {
					$scope.problem.maxAns = tId;
				}
			}
		}).catch(function(data) {
		});
	};
	($scope.updateProblem = function() {
		$http.post('/api/contest/problemconf', {
			contestId: $scope.contestId,
			problemId: $scope.problemId
		}).then(function(data) {
			$scope.problem.title = data.data.title;
			$scope.problem.token = data.data.description;
			$scope.fetchData();
		}).catch(function(error) {
			$scope.needReload = true;
		});
		$http.post('/api/contest/submittable', {
			contestId: $scope.contestId,
		}).then(function(data) {
			$scope.submittable = true;
		});
	})();
	$scope.submit = {
	};
	$scope.answers = [];
	$scope.addAnswer = function(file) {
		if (typeof(file) !== 'object') {
			return;
		}
		var reader = new FileReader;
		reader.onload = function() {
			var ret = {
				code: this.result,
				filename: file.name,
				size: file.size
			};
			$scope.applyAnswer(ret);
		};
		reader.readAsBinaryString(file);
	
	};
	$scope.addAnswers = function() {
		var ele = document.getElementById('answer').files;
		for (var i in ele) {
			var file = ele[i];
			$scope.addAnswer(file);
		}
	};
	$timeout(function() {
		document.getElementById('answer').onchange = $scope.addAnswers;
	}, 1000);
	$scope.applyAnswer = function(ans) {
		if (typeof(ans) === 'object') {
			ans.num = $scope.answers.length;
			if (ans.filename.match(/\d*\.out/)) {
				ans.num = parseInt(ans.filename.split('.')[0]);
			}
			if ($scope.answers.length === $scope.problem.maxAns) {
				$scope.answers.shift();
			}
			$scope.answers.push(ans);
			$timeout(function() {
				$scope.answers = $scope.answers;
			}, 200);
		}
	};
	($scope.fetchHistory = function() {
		$http.post('/api/contest/status', {
			contestId: $scope.contestId,
			problem_id: $scope.problemId,
			requestOwn: true
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
		$http.post('/api/contest/submit', frm).then(function(data) {
			$state.go('contest.status', {
				contestId: $scope.contestId
			});
		}).catch(function(error) {
			console.log(error);
			alert(error.data);
		});
	};
	$scope.removeAns = function(i) {
		$scope.answers = $scope.answers.slice(0, i).concat($scope.answers.slice(i + 1));
	};
} ];
