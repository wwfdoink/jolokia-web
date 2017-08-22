angular.module('jolokiaWeb').service("JolokiaService", function($http, jsPath){
    this.checkPolicy = function(){
        return $http.get(jsPath.api + "/checkPolicy");
    }
    this.version = function(){
        return $http.get(jsPath.api + "/version");
    }
    this.getMbeanTree = function(){
        return $http.get(jsPath.api + "/beans");
    }
    this.read = function(path){
        return $http.post(jsPath.api + "/read", {mbean: path});
    }
    this.write = function(mbean, attribute, value){
        return $http.post(jsPath.api + "/write",{
            mbean: mbean,
            attribute: attribute,
            value: value
        });
    }
    this.execute = function(mbean, operation, paramArray){
        if (!_.isArray(paramArray)) {
            throw "paramArray is not an array..";
        }
        return $http.post(jsPath.api + "/execute", {
            mbean: mbean,
            operation: operation,
            data: paramArray
        });
    }
    // Run garbage collector
    this.gcRun = function(){
        return $http.get(jsPath.api + "/gcRun");
    }
});