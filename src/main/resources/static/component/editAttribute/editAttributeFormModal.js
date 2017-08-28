angular.module("jolokiaWeb").component('editAttributeFormModal', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/editAttribute/editAttributeFormModal.html';
    },
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function (JolokiaService, $uibModal) {
        var self = this;

        self.$onInit = function () {
            self.bean = self.resolve.bean;
            self.attr = angular.copy(self.resolve.attr);
        };

        self.cancel = function () {
            self.dismiss({$value: 'cancel'});
        };

        self.save = function(){
            self.error = null;

            self.loading = true;
            JolokiaService.write(self.bean.id, self.attr.name, self.attr.value).then(function(res) {
                self.resolve.attr.value = self.attr.value;
                self.cancel();
            }).catch(function(err){
                if (_.isObject(err.data)) { self.error = err.data.error; }
                else { self.error = err.data; }
            }).finally(function(){
                self.loading = false;
            });
        }
    }
});
