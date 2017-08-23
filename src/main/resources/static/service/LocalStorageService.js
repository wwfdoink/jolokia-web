angular.module('jolokiaWeb').service("LocalStorageService", function(){
    var prefix = "jolokiaweb.";
    this.get = function(param){
        var val = localStorage.getItem(prefix + param);
        if (val === null) {
            return val;
        }
        return JSON.parse(val);
    }
    this.set = function(param, val){
        localStorage.setItem(prefix + param, JSON.stringify(val));
    }
});