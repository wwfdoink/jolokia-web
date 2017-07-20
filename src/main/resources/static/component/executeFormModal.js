angular.module("myApp").component('executeFormModal', {
    templateUrl: '/jolokiaweb/static/component/executeFormModal.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($scope, JolokiaService, $uibModal) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.bean = $ctrl.resolve.bean;
            $ctrl.operation = $ctrl.resolve.operation;
            $ctrl.isError = false;
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };

        $ctrl.getOperationNameWithSignature = function(){
            // since some of the functions are overloaded, you need to pass the signatures to the method name
            var sigArr = _.map($ctrl.resolve.operation.args, function(arg){
                return arg.typeOrig;
            });
            return $ctrl.operation.name + "(" + sigArr.join(',') + ")";
        }

        $ctrl.execute = function(){
            $scope.error = null;

            var params = _.map($ctrl.resolve.operation.args, function(arg){
                return arg.value;
            });

            $scope.loading = true;
            JolokiaService.execute($ctrl.bean.id, $ctrl.getOperationNameWithSignature(), params).then(function(res) {
                $scope.loading = false;
                $ctrl.openResultModal($ctrl.operation.name, res.data, false);
            }).catch(function(err){
                if (_.isObject(err.data)) { $scope.error = err.data.error; }
                else { $scope.error = err.data; }
                $ctrl.openResultModal($ctrl.operation.name, $scope.error, true, $scope.error);
            }).finally(function(){
                $scope.loading = false;
            });
        }

        $ctrl.openResultModal = function(title, data, isError, error) {
            var modalInstance = $uibModal.open({
                component: 'valueDisplayModal',
                resolve: {
                    data: function () {
                        if (_.isEmpty(data) || _.isEmpty(data.value)) {
                            return "Execution completed with no result!";
                        }
                        return data.value;
                    },
                    title: function(){ return title; },
                    isError: function(){ return isError; },
                    error: function(){ return error; }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            });
        };
    }
});
