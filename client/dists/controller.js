var adminDaemonCtrl = [ '$scope', '$http', '$timeout', 'poll', function($scope, $http, $timeout, poll) {
	var updateList = function(res) {
		if (res.data) {
			$scope.list = [];
			for (var i in res.data) {
				$scope.list.push({
					ip: i,
					time: res.data[i]
				});
			}
		}
		$scope.lastUpdateTime = Date.now();
	};
	$scope.list = [];
	($scope.updateList = function() {
		for (var i in $scope.filter) {
			if ($scope.filter[i] === '') {
				$scope.filter[i] = undefined;
			}
		}
		$http.post('/api/admin/judgers').then(updateList).catch(function(error) {
			alert(error.data);
		});
	})();
	poll.push(function() {
		$scope.updateList();
	}, 2, 'autoRefDaemon');
} ]; 


var adminDocCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	MathJax.Hub.Config({ 
		tex2jax: { 
			inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
			processEscapes: true 
		},
		processSectionDelay: 0
	});
	$scope.generatePreview = function() {
		$('#preview').html($scope.descriptionText);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, 'preview' ], function() {
			var text = $('#preview').html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$('#preview').html(newText);
		});
	};
	$scope.downloadDoc = function() {
		$http.get('/staticdata/' + $scope.docId + '.doc.static').then(function(data) {
			$scope.descriptionText = data.data;
			$scope.generatePreview();
		}).catch(function(error) {
			$scope.descriptionText = '未编辑';
		});
	};
	$scope.writeDoc = function() {
		if ($scope.docId.length < 1) {
			alert('无效的ID');
			return;
		}
		$http.post('/api/admin/docupdate', {
			id: $scope.docId,
			text: $scope.descriptionText
		}).then(function(data) { 
			$scope.downloadDoc();
		}).catch(function(error) {
			alert(error.data);
		});
	};
} ];


var adminNavCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
} ];

var adminProblemCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', 'mjLoader', function($scope, $rootScope, $state, $stateParams, $http, mjLoader) {
	mjLoader.init();
	$scope.problemId = $stateParams.problemId;
	$scope.problem = { langs: [], cases: [] };
	$scope.removeLang = function(i) {
		$scope.problem.langs = $scope.problem.langs.slice(0, i).concat($scope.problem.langs.slice(i + 1));
	};
	$scope.removeCase = function(i) {
		$scope.problem.cases = $scope.problem.cases.slice(0, i).concat($scope.problem.cases.slice(i + 1));
	};
	$scope.addCase = {
		ansId: '0',
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
		mjLoader.render($scope.descriptionText, '#preview');
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
	$scope.publicFiles = [];
	$scope.addFile = function(file, type) {
		if (typeof(file) !== 'object') {
			return;
		}
		var reader = new FileReader;
		reader.onload = function() {
			var ret = {
				problemId: $scope.problemId,
				code: btoa(this.result),
				filename: file.name,
				size: file.size
			};
			var url = '/api/admin/problemaddFile';
			if (type === 'public') {
				url = '/api/admin/problemaddPublicFile';
			}
			$http.post(url, ret).then(function(data) {
				if (type === 'public') {
					$scope.publicFiles.push(data.data);
				}
			}).catch(function(error) {
				alert(error.data);
			});
		};
		reader.readAsBinaryString(file);
	};
	$scope.uploadFiles = function() {
		var ele = document.getElementById('answer').files;
		for (var i in ele) {
			var file = ele[i];
			$scope.addFile(file, 'private');
		}
	};
	$scope.uploadPublicFiles = function() {
		var ele = document.getElementById('answer').files;
		for (var i in ele) {
			var file = ele[i];
			$scope.addFile(file, 'public');
		}
	};
} ];


var adminProblemsCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	($scope.updateList = function() {
		$http.post('/api/admin/problemlist').then(function(data) {
			$scope.problems = data.data.reverse();
		});
	})();
	$scope.showCustests = false;
	$scope.addProblem = function() {
		$http.post('/api/admin/problemcreate').then(function(data) {
			$scope.updateList();
		}).catch(function(error) {
			alert(error);
		});
	};
} ];


var adminStatusCtrl = [ '$scope', '$http', '$timeout', 'poll', function($scope, $http, $timeout, poll) {
	var emptyFilter = function() {
		var res = undefined;
		for (var i in $scope.filter) {
			res = res || $scope.filter[i];
		}
		return res === undefined;
	};
	var updateList = function(res) {
		if (res.data) {
			$scope.list = res.data;
		}
		$scope.lastUpdateTime = Date.now();
	};
	$scope.filter = {};
	$scope.list = [];
	($scope.updateList = function() {
		for (var i in $scope.filter) {
			if ($scope.filter[i] === '') {
				$scope.filter[i] = undefined;
			}
		}
		$http.post('/api/admin/status', { queryAttr: JSON.stringify($scope.filter) }).then(updateList);
	})();
	$scope.rejudgeList = function() {
		if (confirm('可能会爆炸. 确定?')) {
			$http.post('/api/admin/rejudge', $scope.filter);
		}
	};
	$scope.rejudge = function(_id) {
		$http.post('/api/admin/rejudge', { _id: _id });
		$scope.updateList();
	};
	poll.push(function() {
		if ($scope.autoref) {
			$scope.updateList();
		}
	}, 2, 'autoRef');
} ]; 


var adminUserCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	$scope.generate = function() {
		$http.post('/api/admin/useradd', {
			raw: $scope.raw,
			startno: $scope.startno,
			prefix: $scope.prefix
		}).then(function(data) {
			$scope.res = data.data;
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.logoutAll = function() {
		$http.post('/api/admin/userlogoutAll');
	};
} ];


var mainCtrl = [ '$scope', '$rootScope', '$http', '$timeout', 'poll', function($scope, $rootScope, $http, $timeout, poll) {
	$rootScope.login = {
		username: '',
		password: ''
	};
	$rootScope.leftWid = 8;
	$rootScope.rightWid = 4;
	$rootScope.changeLR = function() {
		$rootScope.leftWid ^= (8 ^ 12);
		$rootScope.rightWid ^= (4 ^ 12);
	};
	$rootScope.activeContests = {};
	$rootScope.user = {};
	$rootScope.authLogin = function() {
		$http.post('/api/user/login', $rootScope.login).then(function(data) {
			$rootScope.username = $rootScope.login.username;
			$rootScope.loadUserInfo();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$rootScope.loadUserInfo = function() {
		$http.post('/api/user/lookup').then(function(data) {
			if (typeof(data.data) === 'object') {
				$rootScope.currentUser = data.data;
			} else {
				$rootScope.currentUser = null;
			}
		}).catch(function(error) {
			$rootScope.currentUser = null;
		});
		$http.post('/api/user/isroot').then(function(data) {
			$rootScope.isRoot = data.data.isRoot;
		}).catch(function(error) {
			$rootScope.isRoot = false;
		});
	};
	$rootScope.loadUserInfo();
	$rootScope.authLogout = function() {
		$http.post('/api/user/logout').then(function(data) {
			$rootScope.loadUserInfo();
		}).catch(function(error) {
			$rootScope.loadUserInfo();
		});
	};
	poll.push(function() {
		$http.post('/api/user/time').then(function(data) {
			$rootScope.servertime = data.data.time;
		});
	}, 30, 'updateTime');
	poll.push(function() {
		$rootScope.servertime += 1000;
	}, 1, 'incTime');
} ];


var mjLoaderSrv = [ '$interval', '$timeout', function($interval, $timeout) {
	var ret = {};
	ret.loading = false;
	ret.loaded = false;
	ret.init = function() {
		if (ret.loaded === false) {
			if (typeof(MathJax) !== 'object' || typeof(MathJax.Hub) !== 'object') {
				ret.loading = true;
				$timeout(function() {
					ret.init();
				}, 300);
			} else {
				ret.loaded = true;
			}
		}
	};
	ret.render = function(content, elementId) {
		if (!ret.loaded) {
			if (!ret.loading) {
				ret.init();
			}
			$timeout(function() {
				ret.render(content, elementId);
			}, 300);
			return;
		}
		MathJax.Hub.Config({ 
			tex2jax: { 
				inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
				processEscapes: true 
			},
			processSectionDelay: 0,
			processUpdateDelay: 0
		});
		$(elementId).hide();
		$(elementId).html(content);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, elementId.substr(1) ], function() {
			var text = $(elementId).html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$(elementId).html(newText);
			$(elementId).show();
		});
	};
	ret.waitHighlight = function(id) {
		if (typeof(hljs) !== 'object' || document.getElementById(id) === null) {
			$timeout(function() {
				ret.waitHighlight(id);
			}, 100);
		} else {
			hljs.highlightBlock(document.getElementById(id));
		}
	};
	ret.waitId = function(id, exec) {
		if (document.getElementById(id) === null) {
			$timeout(function() {
				ret.waitId(id, exec);
			}, 100);
		} else {
			exec();
		}
	};
	return ret;
} ];

var pollSrv = [ '$interval', '$timeout', function($interval, $timeout) {
	var events = {};
	var ret = {};
	ret.push = function(exec, len, id) {
		events[id] = {
			exec: exec,
			len: len,
			cur: 1
		};
	};
	ret.pull = function(id) {
		events[id] = 0;
	};
	$interval(function() {
		for (var i in events) {
			-- events[i].cur;
			if (events[i].cur <= 0) {
				events[i].cur = events[i].len;
				$timeout(events[i].exec, 0);
			}
		}
	}, 1000);
	return ret;
} ];

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


var contestClarificationCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', 'poll', function($scope, $state, $stateParams, $http, $timeout, poll) {
	$scope.contestId = $stateParams.contestId;
	($scope.fetch = function() {
		$http.post('/api/contest/clariall', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.messages = data.data.reverse();
		}).catch(function(error) {
			console.log(error);
		});
	})();
	$scope.to = [];
	$scope.removeTo = function(i) {
		$scope.to = $scope.to.slice(0, i).concat($scope.to.slice(i + 1));
	};
	$scope.send = function() {
		var tasks = [];
		if ($scope.words.length < 1) {
			return;
		}
		if ($scope.to.length) {
			for (var i in $scope.to) {
				tasks.push($http.post('/api/contest/clarisend', {
					contestId: $scope.contestId,
					text: $scope.words,
					to: $scope.to[i]._id
				}));
			}
		} else {
			tasks.push($http.post('/api/contest/clarisend', {
				contestId: $scope.contestId,
				text: $scope.words,
			}));
		}
		Promise.all(tasks).then(function() {
			$scope.words = '';
			$scope.to = [];
			$scope.fetch();
		}).catch(function(error) {
			console.log(error.data);
		});
	};
	poll.push($scope.fetch, 2, 'autoRefMsg');
	$scope.checkKey = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if (keycode == 13) {  
			$scope.send();
		}
	};
} ];


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

var contestDetailCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', 'mjLoader', function($scope, $state, $stateParams, $http, $timeout, mjLoader) {
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
							mjLoader.waitHighlight(id);
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
	$scope.rejudge = function(_id) {
		$http.post('/api/admin/rejudge', { _id: _id });
		$scope.fetch();
	};
} ];


var contestHomeCtrl = [ '$scope', '$rootScope', '$state', '$stateParams', '$http', 'poll', function($scope, $rootScope, $state, $stateParams, $http, poll) {
    $scope.contestId = $stateParams.contestId;
	($scope.updateInfo = function() {
		$http.post('/api/contest/info', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.contest = data.data;
			$rootScope.activeContests[data.data._id] = data.data;
		}).catch(function(error) {
			$scope.contest = {
				title: error.data
			};
		});
	})();
	($scope.updateProblems = function() {
		$http.post('/api/contest/content', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.problems = data.data;
		}).catch(function(error) {
			$scope.problems = [ {
				title: 'Invisible'
			} ];
		});
	})();
} ];


var contestNavCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', '$timeout', 'poll', function($scope, $rootScope, $state, $stateParams, $http, $timeout, poll) {
	$scope.contestId = $stateParams.contestId;
	$http.post('/api/contest/role', {
		contestId: $scope.contestId
	}).then(function(data) {
		$scope.myRole = data.data.role;
	});
	poll.push(($scope.fetchClari = function() {
		$http.post('/api/contest/clarinew', {
			contestId: $scope.contestId
		}).then(function(data) {
			if (data.data.length > 0 && !$rootScope.isRoot) {
				var info = '新消息:\n';
				for (var i in data.data) {
					info += data.data[i].from.realname + ': ' + data.data[i].text + '\n';
				}
				alert(info);
			}
		}).catch(function(error) {
			console.log(error.data);
		});
	}), 10, 'newClari');
} ];


var contestPlayerCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	($scope.loadUsers = function() {
		$http.post('/api/contest/players', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.players = data.data;
		}).catch(function(error) {
			console.log(error);
		});
		$http.post('/api/contest/delays', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.delays = data.data;
		}).catch(function(error) {
			console.log(error);
		});
	})();
	$scope.applyQuery = function(username, userId, role) {
		$http.post('/api/contest/modifyRole', {
			contestId: $scope.contestId,
			username: username, 
			userId: userId,
			role: role
		}).catch(function(error) {
			alert('Error modifing ' + username + ':\n' + error.data);
		});
	};
	$scope.addPlayer = function() {
		$scope.applyQuery($scope.addUserId, undefined, 'player');
		$timeout($scope.loadUsers, 100);
	};
	$scope.changeRole = function(player) {
		$scope.applyQuery(undefined, player.user._id, player.role);
		$timeout($scope.loadUsers, 100);
	};
	$scope.removeRole = function(player) {
		$scope.applyQuery(undefined, player.user._id, 'none');
		$timeout($scope.loadUsers, 100);
	};
	$scope.batchAdd = function() {
		var users = $scope.batchInput.split('\n');
		for (var i in users) {
			var username = users[i];
			if (typeof(username) === 'string' && username.match(/^\w*$/) !== null) {
				$scope.applyQuery(username, undefined, 'player');
			}
		}
		$timeout($scope.loadUsers, 100);
	}
	$scope.addDelay = function() {
		$http.post('/api/contest/delayupdate', {
			contestId: $scope.contestId,
			value: $scope.addDelayVal,
			username: $scope.addDelayUsername
		}).then(function() {
			$scope.loadUsers();
		}).catch(function(error) {
			alert(error.data);
		});
	};
	$scope.changeDelay = function(d) {
		$http.post('/api/contest/delayupdate', {
			contestId: $scope.contestId,
			value: d.value,
			userId: d.user._id
		}).then(function() {
			$scope.loadUsers();
		}).catch(function(error) {
			alert(error.data);
		});
	};
} ];



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
			if (ans.filename.match(/\d+\.out/)) {
				ans.num = parseInt(ans.filename.match(/\d+/)[0]);
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
				if ($scope.historys[i].status !== 'Compilaion Error' && (fv === -1 || $scope.historys[fv].submitted_time < $scope.historys[i].submitted_time)) {
					fv = i;
				}
			}
			if (fv !== -1) {
				$scope.historys[fv].isFinal = true;
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

var contestRanklistCtrl = [ '$scope', '$state', '$stateParams', '$http', '$timeout', function($scope, $state, $stateParams, $http, $timeout) {
	$scope.contestId = $stateParams.contestId;
	($scope.fetch = function() {
		$http.post('/api/contest/ranklist', {
			contestId: $scope.contestId
		}).then(function(data) {
			$scope.problems = data.data.problems;
			$scope.users = data.data.list;
			$scope.users.sort(function(a, b) {
				return b.total_score - a.total_score;
			});
			if ($scope.users.length > 0) {
				$scope.users[0].rank = 1;
				for (var i = 1; i < $scope.users.length; ++ i) {
					if ($scope.users[i].total_score === $scope.users[i - 1].total_score) {
						$scope.users[i].rank = $scope.users[i - 1].rank;
					} else {
						$scope.users[i].rank = i;
					}
				}
			}
		}).catch(function(error) {
			console.log(error);
		});
	})();
} ];

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


var contestListCtrl = [ '$scope', '$state', '$http', '$timeout', function($scope, $state, $http, $timeout) {
	$scope.list = [];
	($scope.updateList = function() {
		$http.post('/api/contest/list').then(function(data) {
			$scope.list = [];
			for (var i in data.data) {
				if (data.data[i].contest != null && data.data[i].contest != -1) {
					$scope.updateContest(data.data[i].contest, data.data[i].role);
				}
			}
		}).catch(function(error) {
		});
	})();
	$scope.updateContest = function(contestId, role) {
		$http.post('/api/contest/info', {
			contestId: contestId
		}).then(function(data) {
			data.data.role = role;
			$scope.list.push(data.data);
			$scope.list.sort(function(a, b) {
				return b.start_time - a.start_time;
			});
		}).catch(function(error) {
			console.log(error);
		});
	};
	$scope.addContest = function() {
		$http.post('/api/contest/create').then(function(data) {
			$scope.updateList();
		}).catch(function(error) {
			alert(error.data);
		});
	};
} ];

var docViewCtrl = [ '$scope', '$rootScope', '$state', '$stateParams','$http', function($scope, $rootScope, $state, $stateParams, $http) {
	$scope.docId = $stateParams.docId;
	MathJax.Hub.Config({ 
		tex2jax: { 
			inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
			processEscapes: true 
		},
		processSectionDelay: 0
	});
	$scope.generatePreview = function() {
		$('#preview').html($scope.descriptionText);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, 'preview' ], function() {
			var text = $('#preview').html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$('#preview').html(newText);
		});
	};
	($scope.downloadDoc = function() {
		$http.get('/staticdata/' + $scope.docId + '.doc.static').then(function(data) {
			$scope.descriptionText = data.data;
			$scope.generatePreview();
		}).catch(function(error) {
			$scope.descriptionText = '没有此文档';
		});
	})();
} ];

