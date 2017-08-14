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
            $ctrl.value = $ctrl.resolve.value;
            $ctrl.title = (typeof $ctrl.resolve.title != "undefined") ? $ctrl.resolve.title : "Value Inspector";
        };

        this.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };

        this.getType = function(){
            if (Array.isArray($ctrl.value) && ($ctrl.value.length>0) && _.isObject($ctrl.value[0])) {
                return "objectArray";
            } else if (Array.isArray($ctrl.value)) {
                return "array";
            } else if (_.isObject($ctrl.value)) {
                return "object";
            } else {
                return "simple";
            }
        }
    }
});
