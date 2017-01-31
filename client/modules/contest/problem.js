var contestProblemCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	MathJax.Hub.Config({ 
		tex2jax: { 
			inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
			processEscapes: true 
		},
		processSectionDelay: 0
	});
	$scope.contestId = $stateParams.contestId;
	$scope.problemId = $stateParams.problemId;
	$scope.problem = {
		maxAns: 3
	};
	$scope.renderDescription = function(content) {
		$('#problemtext').html(content);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, 'problemtext' ], function() {
			var text = $('#problemtext').html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$('#problemtext').html(newText);
		});
	};
	$scope.fetchData = function() {
		$http.get('/staticdata/' + $scope.problem.token + '.description').then(function(data) {
			$scope.renderDescription(data.data);
			$scope.needReload = false;
		}).catch(function(data) {
			$scope.needReload = true;
		});
		$http.get('/staticdata/' + $scope.problem.token + '.config').then(function(data) {
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
	})();
	$scope.submit = {
	};
	$scope.problem.langs = [ {
		name: 'g++'
	}, {
		name: 'g++ with std11'
	}, {
		name: 'gcc'
	}, {
		name: 'pascal' 
	} ];
	$scope.submit.lang = $scope.problem.langs[0];
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
	}, 100);
	$scope.applyAnswer = function(ans) {
		if (typeof(ans) === 'object') {
			ans.num = 1;
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
