var app = angular.module('myApp');

app.service("JolokiaService", function($http){
    this.dashboard = function(){
        return $http.get("/jolokiaweb/api/dashboard");
    }
    this.version = function(){
        return $http.get("/jolokiaweb/api/version");
    }
    this.getMbeanTree = function(){
        return $http.get("/jolokiaweb/api/beans");
    }
    this.read = function(path){
        return $http.post("/jolokiaweb/api/read", {mbean: path});
    }
    this.write = function(mbean, attribute, value){
        return $http.post("/jolokiaweb/api/write",{
            mbean: mbean,
            attribute: attribute,
            value: value
        });
    }
    this.execute = function(mbean, operation, paramArray){
        if (!_.isArray(paramArray)) {
            throw "paramArray is not an array..";
        }
        return $http.post("/jolokiaweb/api/execute", {
            mbean: mbean,
            operation: operation,
            data: paramArray
        });
    }
});