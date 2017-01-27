var contestProblemCtrl = [ '$scope', '$state', '$stateParams', '$http', function($scope, $state, $stateParams, $http) {
	$scope.problem = {
		title: 'problem ' + $stateParams.problemId,
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
} ];
