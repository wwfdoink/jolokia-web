angular.module("myApp").component('executeButton', {
    templateUrl: '/jolokiaweb/static/component/executeButton.html',
    bindings: {
        bean: '<',
        operation: '<'
    },
    controller: function($scope, JolokiaService, $uibModal) {
        var $ctrl = this;
        $scope.loading = false;
        this.$onInit = function(){
            $scope.loading = false;
        }

        this.execute = function(){
            console.log("exec");
            $scope.loading = true;
            JolokiaService.execute(this.bean.id, this.operation.name, null).then(function(res) {
                console.log(res.data);
                $scope.loading = false;
                $ctrl.openComponentModal($ctrl.operation.name, res.data, false);
            }).catch(function(err){
                if (_.isObject(err.data)) { $scope.error = err.data.error; }
                else { $scope.error = err.data; }
                this.openComponentModal($ctrl.operation.name, $scope.error, true);
            }).finally(function(){
                $scope.loading = false;
            });
        }

        this.openComponentModal = function(title, data, isError) {
            var modalInstance = $uibModal.open({
                component: 'valueDisplayModal',
                resolve: {
                    data: function () {
                        if (_.isEmpty(data.value)) {
                            return "Execution completed!";
                        }
                        return data.value;
                    },
                    title: function(){ return title; },
                    isError: function(){ return isError; }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            });
        };

    }
});
