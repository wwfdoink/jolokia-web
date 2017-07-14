angular.module("myApp").controller('MbeanController', function($scope, JolokiaService, $filter) {
    $scope.tree = [];
    JolokiaService.getMbeanTree().then(function(res){
        $scope.tree = $filter('beanTree')(res.data.value);
    });

    $scope.$watch('beanTree.currentNode', function(newObj, oldObj) {
        if ($scope.beanTree && angular.isObject($scope.beanTree.currentNode)) {
            if (!$scope.beanTree.currentNode.class) {
                return;
            }
            var bean = $scope.beanTree.currentNode;
            JolokiaService.read(bean.id).then(function(res) {
                console.log("read:", res.data);
                for (key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        bean.attr.forEach(function(attr){
                            if (key === attr.name) {
                                attr.value = res.data[key];
                            }
                        });
                    }
                }
            });
            console.log($scope.beanTree.currentNode);
        }
    }, false);
});