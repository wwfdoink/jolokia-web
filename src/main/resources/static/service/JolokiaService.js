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
    this.search = function(){
        return $http.get("/jolokiaweb/api/search");
    }
    this.write = function(){
        return $http.get("/jolokiaweb/api/write");
    }
    this.exec = function(){
        return $http.get("/jolokiaweb/api/exec");
    }
});