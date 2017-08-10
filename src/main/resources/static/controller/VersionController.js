angular.module("myApp").controller('VersionController', function($scope, JolokiaService) {
    $scope.versionData = [];
    $scope.runtimeData = [];
    $scope.loading = true;

    JolokiaService.version().then(function(res){
        var verArr = [];
        _.forEach(res.data.version, function(element, key) {
            verArr.push({key:key, value:element});
        });
        $scope.versionData = verArr;

        var runArr = [];
        _.forEach(res.data.runtime, function(element, key) {
            runArr.push({key:key, value:element});
        });
        $scope.runtimeData = runArr;
    }).catch(function(err) {
        if (_.isObject(err.data)) { $scope.error = err.data.error; }
        else { $scope.error = err.data; }
    }).finally(function(){
        $scope.loading = false;
    });
});