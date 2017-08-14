angular.module("myApp").component('valueInspectorTextModal', {
    templateUrl: '/static/component/valueInspector/valueInspectorTextModal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($uibModal) {
        var $ctrl = this;

        this.$onInit = function () {
            $ctrl.value = $ctrl.resolve.value;
        };

        this.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});
