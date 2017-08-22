angular.module("jolokiaWeb").component('versionPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/version/versionPage.html';
    },
    bindings: {
    },
    controller: function(JolokiaService, $filter) {
        var self = this;

        self.versionData = [];
        self.runtimeData = [];
        self.loading = true;

        JolokiaService.version().then(function(res){
            var verArr = [];
            _.forEach(res.data.version, function(element, key) {
                verArr.push({key:key, value:element});
            });
            self.versionData = verArr;

            var runArr = [];
            _.forEach(res.data.runtime, function(element, key) {
                runArr.push({key:key, value:element});
            });
            self.runtimeData = runArr;
        }).catch(function(err) {
            if (_.isObject(err.data)) { self.error = err.data.error; }
            else { self.error = err.data; }
        }).finally(function(){
            self.loading = false;
        });
    }
});