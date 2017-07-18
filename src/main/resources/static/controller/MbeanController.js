angular.module("myApp").controller('MbeanController', function($scope, JolokiaService, $filter) {
    $scope.tree = [];
    $scope.loading = true;
    JolokiaService.getMbeanTree().then(function(res){
        $scope.tree = $filter('beanTree')(res.data.value);
        $scope.loading = false;
    },function(err){
        if (_.isObject(err.data)) { $scope.error = err.data.error; }
        else { $scope.error = err.data; }
        $scope.loading = false;
    });

    $scope.$watch('beanTree.currentNode', function(newObj, oldObj) {
        $scope.error = null;
        if ($scope.beanTree && angular.isObject($scope.beanTree.currentNode)) {
            if (!$scope.beanTree.currentNode.class) {
                return;
            }
            var bean = $scope.beanTree.currentNode;
            $scope.loading = true;
            JolokiaService.read(bean.id).then(function(res) {
                for (key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        bean.attr.forEach(function(attr){
                            if (key === attr.name) {
                                attr.value = res.data[key];
                            }
                        });
                    }
                }
            }).catch(function(err){
                if (_.isObject(err.data)) { $scope.error = err.data.error; }
                else { $scope.error = err.data; }
            }).finally(function(){
                $scope.loading = false;
            });
        }
    }, false);
});