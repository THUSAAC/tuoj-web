var adminProblemCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	MathJax.Hub.Config({ 
		tex2jax: { 
			inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
			processEscapes: true 
		},
		processSectionDelay: 0
	});
	$scope.problemId = $stateParams.problemId;
	$scope.problem = { langs: [], cases: [] };
	$scope.removeLang = function(i) {
		$scope.problem.langs = $scope.problem.langs.slice(0, i).concat($scope.problem.langs.slice(i + 1));
	};
	$scope.removeCase = function(i) {
		$scope.problem.cases = $scope.problem.cases.slice(0, i).concat($scope.problem.cases.slice(i + 1));
	};
	$scope.addCase = {
		ansId: '1',
		score: '10',
		inputFile: 'data/<i>.in',
		outputFile: 'data/<i>.out',
		time_limit: '1000',
		mem_limit: '512',
		spjPath: ''
	};
	$scope.defLangs = {
		answer: [ {
			name: 'answer',
			exec: 'cp',
			args: ''
		} ], original: [ {
			name: 'g++',
			exec: 'g++',
			args: '-DONLINE_JUDGE'
		}, {
			name: 'g++ with std11',
			exec: 'g++',
			args: '-std=c++11 -DONLINE_JUDGE'
		}, {
			name: 'gcc',
			exec: 'gcc',
			args: '-DONLINE_JUDGE'
		}, {
			name: 'pascal',
			exec: 'fpc',
			args: ''
		} ], originalO2: [ {
			name: 'g++',
			exec: 'g++',
			args: '-O2 -DONLINE_JUDGE'
		}, {
			name: 'g++ with std11',
			exec: 'g++',
			args: '-O2 -std=c++11 -DONLINE_JUDGE'
		}, {
			name: 'gcc',
			exec: 'gcc',
			args: '-O2 -DONLINE_JUDGE'
		}, {
			name: 'pascal',
			exec: 'fpc',
			args: '-O2'
		} ]
	};
	$scope.addRuledCase = function() {
		var newCase = {};
		var id = $scope.problem.cases.length;
		for (var i in $scope.addCase) {
			if (typeof($scope.addCase[i]) === 'string') {
				newCase[i] = $scope.addCase[i].replace(/\<i\>/g, id);
			} else {
				newCase[i] = $scope.addCase[i];
			}
		}
		$scope.problem.cases.push(newCase);
	};
	$scope.fillCase = function() {
		for (var j in $scope.problem.cases) {
			for (var i in $scope.addCase) {
				if (typeof($scope.addCase[i]) === 'string') {
					if ($scope.addCase[i] === '') {
						continue;
					}
					$scope.problem.cases[j][i] = $scope.addCase[i].replace(/\<i\>/g, j);
				} else if ($scope.addCase[i] != null) {
					$scope.problem.cases[j][i] = $scope.addCase[i];
				}
			}
		}
	};
	($scope.fetchConfig = function() {
		$http.post('/api/admin/problemgetConfig', {
			problemId: $scope.problemId
		}).then(function(data) {
			$scope.problem._id = data.data._id;
			$scope.problem.title = data.data.title;
			$scope.problem.local = data.data.local;
			$scope.problem.cases = data.data.cases || [];
			$scope.problem.langs = data.data.langs || [];
			$scope.data = data.data.data;
			$scope.description = data.data.description;
			$http.get('/staticdata/' + $scope.description + '.description').then(function(data) {
				$scope.descriptionText = data.data;
			}).catch(function(error) {
				$scope.descriptionText = '未生成或未同步';
			});
		}).catch(function(error) {
			alert(error.data);
		});
	})();
	$scope.syncLocal = function() {
		$http.post('/api/admin/problemsyncLocal', {
			problemId: $scope.problemId,
			local: $scope.problem.local
		}).then(function(data) {
			$scope.fetchConfig();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	var clean = function(a) {
		var ret = {};
		for (var i in a) {
			if (i.match(/\$/) === null) {
				ret[i] = a[i];
			}
		}
		return ret;
	};
	var purify = function(a) {
		var ret = [];
		for (var i in a) {
			if (typeof(i) === 'number' || (typeof(i) === 'string' && i.match(/^\d*$/) !== null)) {
				ret.push(clean(a[i]));
			}
		}
		return ret;
	};
	$scope.writeConfig = function() {
		$http.post('/api/admin/problemconfig', {
			problemId: $scope.problemId,
			title: $scope.problem.title,
			local: $scope.problem.local,
			cases: JSON.stringify(purify($scope.problem.cases)),
			langs: JSON.stringify(purify($scope.problem.langs))
		}).then(function(data) {
			$scope.fetchConfig();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.generatePreview = function() {
		$('#preview').html($scope.descriptionText);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, 'preview' ], function() {
			var text = $('#preview').html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$('#preview').html(newText);
		});
	};
	$scope.writeDoc = function() {
		$http.post('/api/admin/problemupdateDescription', {
			problemId: $scope.problemId,
			descriptionText: $scope.descriptionText
		}).then(function(data) {
			$scope.fetchConfig();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.viewLocal = function() {
		$http.post('/api/admin/problemviewLocal', {
			problemId: $scope.problemId,
		}).then(function(data) {
			$scope.dirFiles = data.data;
		});
	};
} ];

