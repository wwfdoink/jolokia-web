angular.module("myApp").component('valueDisplay', {
    templateUrl: '/jolokiaweb/static/component/valueDisplay.html',
    bindings: {
        myValue: '<'
    },
    controller: function($scope) {
        this.isType = function(type){
            if (Array.isArray(this.myValue)) {
                return "array" === type;
            } else if (_.isObject(this.myValue)) {
                return "object" === type;
            } else if (_.isNumber(this.myValue)) {
                return "number" === type;
            } else {
                return "simple" === type;
            }
        }
    }
});
