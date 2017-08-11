angular.module("myApp").component('valueInspectorModal', {
    templateUrl: '/static/component/valueInspector/valueInspectorModal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($uibModal) {
        var $ctrl = this;

        this.$onInit = function () {
            $ctrl.myValue = $ctrl.resolve.myValue;
        };

        this.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };

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
    }
});
