angular.module("myApp").component('executeFormModal', {
    templateUrl: '/static/component/execute/executeFormModal.html',
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
            params = params.filter(function(item){ return item != undefined });

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
            var modalInstance;

            if (isError || (_.isEmpty(data) || (typeof data.value === "undefined") || _.isEmpty(data.value) || (data.value === null))) {
                // if it's just a simple error or empty value we don't need the valueInspector
                modalInstance = $uibModal.open({
                    component: 'executeSimpleModal',
                    resolve: {
                        data: function () {
                            if (_.isEmpty(data) || _.isEmpty(data.value)) {
                                return null;
                            }
                            return data.value;
                        },
                        title: function(){ return title; },
                        isError: function(){ return isError; },
                        error: function(){ return error; }
                    }
                }, function(){
                    //Cancel
                });
            } else {
                // if all good and got a non-empty result then we want the valueInspector
                modalInstance = $uibModal.open({
                    component: 'valueInspectorModal',
                    resolve: {
                        value: function () {
                            return data.value;
                        },
                        title: function(){ return title; }
                    },
                    size: 'lg'
                }, function(){
                    //Cancel
                });

            }

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            });
        };
    }
});
