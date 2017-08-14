angular.module("myApp").component('valueInspector', {
    templateUrl: '/static/component/valueInspector/valueInspector.html',
    bindings: {
        value: '<'
    },
    controller: function($scope, $uibModal) {
        var $ctrl = this;

        this.isType = function(type){
            if (Array.isArray($ctrl.value)) {
                return "array" === type;
            } else if (_.isObject($ctrl.value)) {
                return "object" === type;
            } else if (_.isNumber($ctrl.value)) {
                return "number" === type;
            } else {
                return "simple" === type;
            }
        }

        this.isEmptyArray = function(){
            return $ctrl.isType("array") && $ctrl.value.length > 0;
        }

        this.openModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorModal',
                resolve: {
                    value: function(){ return $ctrl.value; }
                }
            }, function() {
                // Cancel
            });
        };
    }
});
