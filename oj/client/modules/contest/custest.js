var contestCustestCtrl = [ '$scope', '$rootScope', '$state', '$stateParams', '$http', '$timeout', 'mjLoader', function($scope, $rootScope, $state, $stateParams, $http, $timeout, mjLoader) {
	$scope.contestId = $stateParams.contestId;
	$scope.submit = {};
	$scope.answers = [];
	$scope.problem = {
		maxAns: 3
	};
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
	$scope.removeAns = function(i) {
		$scope.answers = $scope.answers.slice(0, i).concat($scope.answers.slice(i + 1));
	};
	$scope.addAnswers = function() {
		var ele = document.getElementById('answer').files;
		for (var i in ele) {
			var file = ele[i];
			$scope.addAnswer(file);
		}
	};
	$scope.applyAnswer = function(ans) {
		if (typeof(ans) === 'object') {
			ans.num = $scope.answers.length;
			$scope.answers.size=ans.size;
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
	($scope.updateInfo = function() {
		$http.get('/staticdata/cus.config.default').then(function(data) {
			$scope.langs = data.data.langs;
			$scope.cases = data.data.cases;
			$scope.submit.lang = $scope.langs[0];
		});
		$http.post('/api/contest/submittable', {
			contestId: $scope.contestId,
		}).then(function(data) {
			$scope.submittable = true;
			mjLoader.waitId('answer', function() {
				document.getElementById('answer').onchange = $scope.addAnswers;
			});
		});
	})();
	($scope.fetch = function() {
		$http.post('/api/contest/custeststatus', {
			contestId: $scope.contestId,
			requestOwn: true,
			type: 'cus'
		}).then(function(data) {
			$scope.historys = data.data;
			$scope.historys.sort(function(a, b) {
				return b.submitted_time - a.submitted_time;
			});
		}).catch(function(error) {
			console.log(error);
		});
		$http.post('/api/contest/custestinque', {
			contestId: $scope.contestId,
		}).then(function(data) {
			$scope.submitMsg = '当前等待队列长度: ' + data.data;
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
		$http.post('/api/contest/custestcreate', frm).then(function(data) {
			$scope.fetch();
		}).catch(function(error) {
			console.log(error);
			alert(error.data);
		});
	};
} ];
