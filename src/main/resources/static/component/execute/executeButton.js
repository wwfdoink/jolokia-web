angular.module("jolokiaWeb").component('executeButton', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/execute/executeButton.html';
    },
    bindings: {
        bean: '<',
        operation: '<'
    },
    controller: function($scope, JolokiaService, $uibModal) {
        var self = this;
        
        this.$onInit = function(){
        }

        this.openForm = function() {
            var modalInstance = $uibModal.open({
                component: 'executeFormModal',
                resolve: {
                    bean: function(){ return self.bean; },
                    operation: function(){ return self.operation; }
                }
            }, function() {
                // Cancel
            });
        };

    }
});
