(function() {
   var RejudgeCtrl = [ '$scope', '$http', '$timeout', function($scope, $http, $timeout) {
       $scope.filter = {};
       $scope.list = [];
       $scope.updateList = function() {
		   for (var i in $scope.filter) {
			   if ($scope.filter[i] === '') {
				   $scope.filter[i] = undefined;
			   }
		   }
           $http.post('/api/status', { queryAttr: JSON.stringify($scope.filter) }).then(function(res) {
               $scope.list = res.data.data.reverse();
           });
       };
       $scope.rejudge = function(_id) {
           $http.post('/api/rejudge', { _id: _id });
           $scope.updateList();
       };
       $scope.rejudgeList = function() {
		   $http.post('/api/rejudge', $scope.filter);
	   };
       $scope.see = function(judge) {
           window.location.href = '/contests/' + judge.contest + '/detail/' + judge._id;
       };
       var autoRef = function() {
           if ($scope.autoref) {
               $scope.updateList();
           }
           $timeout(autoRef, 2048);
       };
       autoRef();
   } ]; 
   angular.module('tuoj-web', []).controller('RejudgeCtrl', RejudgeCtrl);
})();