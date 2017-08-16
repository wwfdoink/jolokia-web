var app = angular.module('myApp');

app.service("JolokiaService", function($http){
    this.dashboard = function(){
        return $http.get("/api/dashboard");
    }
    this.version = function(){
        return $http.get("/api/version");
    }
    this.getMbeanTree = function(){
        return $http.get("/api/beans");
    }
    this.read = function(path){
        return $http.post("/api/read", {mbean: path});
    }
    this.write = function(mbean, attribute, value){
        return $http.post("/api/write",{
            mbean: mbean,
            attribute: attribute,
            value: value
        });
    }
    this.execute = function(mbean, operation, paramArray){
        if (!_.isArray(paramArray)) {
            throw "paramArray is not an array..";
        }
        return $http.post("/api/execute", {
            mbean: mbean,
            operation: operation,
            data: paramArray
        });
    }
    // Run garbage collector
    this.gcRun = function(){
        return $http.get("/api/gcRun");
    }
});