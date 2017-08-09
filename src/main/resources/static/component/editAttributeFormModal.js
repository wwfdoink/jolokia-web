angular.module("myApp").component('editAttributeFormModal', {
    templateUrl: '/static/component/editAttributeFormModal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($scope, JolokiaService, $uibModal) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.bean = $ctrl.resolve.bean;
            $ctrl.attr = angular.copy($ctrl.resolve.attr);
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };

        $ctrl.save = function(){
            $ctrl.error = null;

            $scope.loading = true;
            JolokiaService.write($ctrl.bean.id, $ctrl.attr.name, $ctrl.attr.value).then(function(res) {
                $ctrl.resolve.attr.value = $ctrl.attr.value;
                $ctrl.cancel();
            }).catch(function(err){
                if (_.isObject(err.data)) { $ctrl.error = err.data.error; }
                else { $ctrl.error = err.data; }
            }).finally(function(){
                $scope.loading = false;
            });
        }
    }
});
