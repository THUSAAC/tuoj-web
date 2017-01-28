var contestProblemCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.problem = {
		title: 'problem ' + $stateParams.problemId,
		maxAns: 3
	};
	($scope.updateProblem = function() {
		$http.get('/sampleprob.md').then(function(data) {
			$scope.needReload = false;
			$('#problemtext').html(data.data);
			MathJax.Hub.Config({ 
				tex2jax: { 
					inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
					processEscapes: true 
				},
				processSectionDelay: 0
			});
			MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, 'problemtext' ], function() {
				var text = $('#problemtext').html();
				var converter = new showdown.Converter();
				var newText = converter.makeHtml(text);
			$('#problemtext').html(newText);
			});
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
			for (var i = 1; i <= $scope.problem.maxAns; ++ i) {
				if (ans.filename === i + '.out') {
					ans.num = i;
				}
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
} ];
