angular.module("myApp").component('valueInput', {
    templateUrl: '/jolokiaweb/static/component/valueInput.html',
    bindings: {
        arg: '='
    },
    controller: function($scope) {
        this.$onInit = function(){
            if (this.arg.type === "boolean") {
                this.arg.value = false;
            }
        }
        this.getType = function(){
            if (this.arg.type === "[Ljava.lang.String;") {
                return "array";
            } else if (this.arg.type === "boolean") {
                return "bool";
            } else if (this.isNumber(this.arg.type)) {
                return "number";
            } else {
                return "simple";
            }
        }

        this.isNumber = function(type){
            if (type === "long" || type === "double" || type === "int") {
                return true;
            }
            return false;
        }

        this.getTypeText = function(){
            var type = this.getType();
            if (type === "array") {
                return "Array";
            } else if (type === "boolean") {
                return "Boolean";
            } else if (this.isNumber(this.arg.type)) {
                return "Number";
            } else {
                return "Text";
            }
        }
    }
});
