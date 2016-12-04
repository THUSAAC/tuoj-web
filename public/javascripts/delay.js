(function() {
    var DelayCtrl = [ '$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        var clrInfo = function() {
            $scope.textError = '';
            $scope.textInfo = 'Adding';
        };
        var respondRes = function(res) {
            $scope.textError = '';
            $scope.textInfo = 'Done';
            $scope.updateDelayList();
        };
        var respondError = function(error) {
            $scope.textError = error;
            $scope.textInfo = '';
            $scope.updateDelayList();
        };
        $scope.delayList = [];
        $scope.updateDelayList = function() {
            $http.post('/api/delay/list', {}).then(function(res) {
                $scope.delayList = res.data.data.reverse();
            });
        };
        $scope.updateDelayList();
        $scope.newDelay = {};
        $scope.applyNewDelay = function() {
            clrInfo();
            $http.post('/api/delay/add', $scope.newDelay)
                .then(respondRes).catch(respondError);
        };
        $scope.updateDelay = function(delay) {
            $http.post('/api/delay/add', {
                username: delay.user.username,
                contestId: delay.contest._id,
                value: delay.value
            }).then(respondRes).catch(respondError);
        };
    } ];
    angular.module('tuoj-web', []).controller('DelayCtrl', DelayCtrl);
})();

