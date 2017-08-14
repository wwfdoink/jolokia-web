angular.module("myApp").component('executeButton', {
    templateUrl: '/static/component/execute/executeButton.html',
    bindings: {
        bean: '<',
        operation: '<'
    },
    controller: function($scope, JolokiaService, $uibModal) {
        var $ctrl = this;
        $scope.loading = false;
        this.$onInit = function(){
            $scope.loading = false;
        }

        this.openForm = function() {
            var modalInstance = $uibModal.open({
                component: 'executeFormModal',
                resolve: {
                    bean: function(){ return $ctrl.bean; },
                    operation: function(){ return $ctrl.operation; }
                }
            }, function() {
                // Cancel
            });
        };

    }
});
