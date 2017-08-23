angular.module("jolokiaWeb").component('gcButton', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/gcButton/gcButton.html';
    },
    bindings: {
    },
    controller: function($scope, JolokiaService) {
        var $ctrl = this;
        $scope.loading = false;

        this.gcRun = function(){
            $scope.loading = true;

            JolokiaService.gcRun().then(function(){
            }).catch(function(err){
                alert((err.data) ? JSON.stringify(err.data) : "Failed to load resource: [" + err.config.method + "] " + err.config.url);
            }).finally(function(){
                $scope.loading = false;
            });
        }

    }
});
