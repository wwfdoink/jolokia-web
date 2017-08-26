angular.module('jolokiaWeb').service("JolokiaService", function($http, jsPath){
    var permissionsList = [];
    var checkPolicy = function(){
        return $http.get(jsPath.api + "/checkPermissions");
    }
    // resolve permissions on init
    checkPolicy().then(function(result){
        permissionsList = result.data.permissions;
    });

    this.hasPermission = function(arg){
        return (_.indexOf(permissionsList, arg) > -1);
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