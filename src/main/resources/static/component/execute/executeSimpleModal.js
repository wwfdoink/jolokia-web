angular.module("jolokiaWeb").component('executeSimpleModal', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/execute/executeSimpleModal.html';
    },
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.title = $ctrl.resolve.title;
            $ctrl.data = $ctrl.resolve.data;
            $ctrl.isError = $ctrl.resolve.isError;
            $ctrl.error = $ctrl.resolve.error;
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});
