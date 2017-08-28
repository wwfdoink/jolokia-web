angular.module("jolokiaWeb").component('valueInspector', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/valueInspector/valueInspector.html';
    },
    bindings: {
        value: '<'
    },
    controller: function($scope, $uibModal) {
        var self = this;

        self.isType = function(type){
            if (Array.isArray(self.value)) {
                return "array" === type;
            } else if (_.isObject(self.value)) {
                return "object" === type;
            } else if (_.isNumber(self.value)) {
                return "number" === type;
            } else {
                return "simple" === type;
            }
        }
        self.isHugeText = function(){
            if ((typeof self.value == "string") && (self.value.length > 200)) {
                return true;
            }
            return false;
        }
        self.isEmptyArray = function(){
            return self.isType("array") && self.value.length < 1;
        }
        self.isEmptyObject = function(){
            return self.isType("object") && Object.keys(self.value).length < 1;
        }
        self.isEmptyString = function(){
            return (typeof self.value === 'string') && (self.value.length < 1);
        }
        self.isNull = function(){
            return (self.value === null);
        }
        self.isEmpty = function(){
            return (self.isNull() || self.isEmptyString() || self.isEmptyObject() || self.isEmptyArray());
        }

        self.openModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorModal',
                resolve: {
                    value: function(){ return self.value; }
                },
                size: 'lg'
            }, function() {
                // Cancel
            });
        };

        // Huge texts only
        self.openTextModal = function() {
            var modalInstance = $uibModal.open({
                component: 'valueInspectorTextModal',
                resolve: {
                    value: function(){ return self.value; }
                },
                size: 'lg'
            }, function() {
                    // Cancel
            });
        }
    }
});
