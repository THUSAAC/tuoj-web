var contestProblemCtrl = [ '$scope', '$rootScope', '$state', '$stateParams', '$http', '$timeout', 'mjLoader', function($scope, $rootScope, $state, $stateParams, $http, $timeout, mjLoader) {
	mjLoader.init();
	$scope.contestId = $stateParams.contestId;
	$scope.problemId = $stateParams.problemId;
	if ($scope.problemId == '-1') {
		return $state.go('contest.custest', {
			contestId: $scope.contestId
		});
	}
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
				var tId = parseInt($scope.cases[i].ansId) + 1;
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
			$scope.answers.size=ans.size;
			if (ans.filename.match(/\d+\.out/)) {
				ans.num = parseInt(ans.filename.match(/\d+/)[0]);
			}
			if ($scope.problem.maxAns === 1) {
				ans.num = 0;
			}
			if ($scope.answers.length >= $scope.problem.maxAns) {
				$scope.answers.shift();
			}
			$scope.answers.unshift(ans);
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
			var fv = -1;
			for (var i in $scope.historys) {
				if ($scope.historys[i].status === undefined) {
					$scope.historys[i].status = 'Invisible';
				}
				const ignoreList = [ 'Compilaion Error', 'Creating' ];
				if (ignoreList.indexOf($scope.historys[i].status) === -1 && (fv === -1 || $scope.historys[fv].submitted_time < $scope.historys[i].submitted_time)) {
					fv = i;
				}
			}
			if (fv !== -1) {
				$scope.historys[fv].isFinal = true;
			}
			$scope.historys.sort(function(a, b) {
				return a.submitted_time - b.submitted_time;
			});
			$.extend( true, $.fn.dataTable.defaults, {
				"bLengthChange": false,
				"bFilter": false,
				"bInfo": false,
				"bAutoWidth": false,
				"searching": false,
				"ordering": true
			} );
			$timeout(function() {
				$('#abcd').dataTable({"pagingType": "numbers","order": [[ 0, "desc" ]]});
			},100);
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
