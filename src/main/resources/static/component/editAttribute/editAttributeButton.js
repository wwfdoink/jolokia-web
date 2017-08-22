angular.module("jolokiaWeb").component('editAttributeButton', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/editAttribute/editAttributeButton.html';
    },
    bindings: {
        bean: '<',
        attr: '<'
    },
    controller: function($scope, JolokiaService, $uibModal) {
        var $ctrl = this;
        $scope.loading = false;
        this.$onInit = function(){
            $scope.loading = false;
        }

        this.openForm = function() {
            var modalInstance = $uibModal.open({
                component: 'editAttributeFormModal',
                resolve: {
                    bean: function(){ return $ctrl.bean; },
                    attr: function(){ return $ctrl.attr; }
                }
            }, function() {
                // Cancel
            });
        };

    }
});
