angular.module("jolokiaWeb").component('editAttributeButton', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/editAttribute/editAttributeButton.html';
    },
    bindings: {
        bean: '<',
        attr: '<'
    },
    controller: function(JolokiaService, $uibModal) {
        var self = this;

        this.$onInit = function(){
            self.loading = false;
        }

        this.openForm = function() {
            var modalInstance = $uibModal.open({
                component: 'editAttributeFormModal',
                resolve: {
                    bean: function(){ return self.bean; },
                    attr: function(){ return self.attr; }
                }
            }, function() {
                // Cancel
            });
        };

    }
});
