(function() {
   var RejudgeCtrl = [ '$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	   var emptyFilter = function() {
		   var res = undefined;
		   for (var i in $scope.filter) {
			   res = res || $scope.filter[i];
		   }
		   return res === undefined;
	   };
	   var updateList = function(res) {
		   if (res.data.data) {
			   $scope.list = res.data.data;
		   }
		   $scope.lastUpdateTime = Date.now();
	   };
       $scope.filter = {};
       $scope.list = [];
       $scope.updateList = function() {
		   for (var i in $scope.filter) {
			   if ($scope.filter[i] === '') {
				   $scope.filter[i] = undefined;
			   }
		   }
		   $http.post('/api/status', { queryAttr: JSON.stringify($scope.filter) }).then(updateList);
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
