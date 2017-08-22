angular.module("jolokiaWeb").component('valueInspector', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/valueInspector/valueInspector.html';
    },
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
        this.isHugeText = function(){
            if ((typeof $ctrl.value == "string") && ($ctrl.value.length > 200)) {
                return true;
            }
            return false;
        }
        this.isEmptyArray = function(){
            return $ctrl.isType("array") && $ctrl.value.length > 0;
        }

        this.openModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorModal',
                resolve: {
                    value: function(){ return $ctrl.value; }
                },
                size: 'lg'
            }, function() {
                // Cancel
            });
        };

        // Huge texts only
        this.openTextModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorTextModal',
                resolve: {
                    value: function(){ return $ctrl.value; }
                },
                size: 'lg'
            }, function() {
                    // Cancel
            });
        }
    }
});
