angular.module("myApp").component('valueInspector', {
    templateUrl: '/static/component/valueInspector/valueInspector.html',
    bindings: {
        myValue: '<'
    },
    controller: function($scope, $uibModal) {
        var $ctrl = this;

        this.isType = function(type){
            if (Array.isArray($ctrl.myValue)) {
                return "array" === type;
            } else if (_.isObject($ctrl.myValue)) {
                return "object" === type;
            } else if (_.isNumber($ctrl.myValue)) {
                return "number" === type;
            } else {
                return "simple" === type;
            }
        }

        this.isEmptyArray = function(){
            return $ctrl.isType("array") && $ctrl.myValue.length > 0;
        }

        this.openModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorModal',
                resolve: {
                    myValue: function(){ return $ctrl.myValue; }
                }
            }, function() {
                // Cancel
            });
        };
    }
});
