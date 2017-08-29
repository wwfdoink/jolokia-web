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
        var self = this;

        self.$onInit = function () {
            self.title = self.resolve.title;
            self.data = self.resolve.data;
            self.isError = self.resolve.isError;
            self.error = self.resolve.error;
        };

        self.cancel = function () {
            self.dismiss({$value: 'cancel'});
        };
    }
});
