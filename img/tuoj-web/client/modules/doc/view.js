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

