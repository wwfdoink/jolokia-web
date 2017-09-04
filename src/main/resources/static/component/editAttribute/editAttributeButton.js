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

        self.$onInit = function(){
            self.loading = false;
        }

        self.isSupportedType = function(){
            var supported = [
                "boolean","int","double","long","float",
                "java.lang.String","java.lang.Boolean","java.lang.Integer","java.lang.Double","java.lang.Long","java.lang.Float",
                "int[]","double[]","long[]","float[]","java.lang.String[]",
                "java.lang.String[]","java.lang.Boolean[]","java.lang.Integer[]","java.lang.Double[]","java.lang.Long[]","java.lang.Float[]",
            ];
            return (supported.indexOf(self.attr.type) > -1);
        }
        self.tooltipMessage = function(){
            if (self.isSupportedType()) {
                return null;                
            } else {
                return self.attr.type + " type is not supported!";
            }
        }

        self.openForm = function() {
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
