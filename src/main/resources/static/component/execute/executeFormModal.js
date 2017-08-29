angular.module("jolokiaWeb").component('executeFormModal', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/execute/executeFormModal.html';
    },
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($scope, JolokiaService, $uibModal) {
        var self = this;

        self.$onInit = function () {
            self.bean = self.resolve.bean;
            self.operation = self.resolve.operation;
            self.isError = false;
            self.loading = false;
        };

        self.cancel = function () {
            self.dismiss({$value: 'cancel'});
        };

        self.getOperationNameWithSignature = function(){
            // since some of the functions are overloaded, you need to pass the signatures to the method name
            var sigArr = _.map(self.resolve.operation.args, function(arg){
                return arg.typeOrig;
            });
            return self.operation.name + "(" + sigArr.join(',') + ")";
        }

        self.execute = function(){
            $scope.error = null;

            var params = _.map(self.resolve.operation.args, function(arg){
                return arg.value;
            });
            params = params.filter(function(item){ return item != undefined });

            self.loading = true;
            JolokiaService.execute(self.bean.id, self.getOperationNameWithSignature(), params).then(function(res) {
                self.loading = false;
                self.openResultModal(self.operation.name, res.data, false);
            }).catch(function(err){
                if (_.isObject(err.data)) { $scope.error = err.data.error; }
                else if (err.data) { self.error = err.data; }
                else { self.error = "Failed to load resource: [" + err.config.method + "] " + err.config.url }
                self.openResultModal(self.operation.name, $scope.error, true, $scope.error);
            }).finally(function(){
                self.loading = false;
            });
        }

        self.openResultModal = function(title, data, isError, error) {
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
                self.selected = selectedItem;
            });
        };
    }
});
