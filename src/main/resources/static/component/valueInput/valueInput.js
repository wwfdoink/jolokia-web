angular.module("myApp").component('valueInput', {
    templateUrl: '/static/component/valueInput/valueInput.html',
    bindings: {
        arg: '='
    },
    controller: function($scope) {
        var $ctrl = this;
        this.$onInit = function(){
            if (this.arg.type === "boolean" && !this.arg.value) {
                this.arg.value = false;
            } else if (_.contains(["java.lang.String[]", "long[]"], this.arg.type)) {
                this.arg.value = [];
            }
        }
        this.getType = function(){
            if (this.isBoolean(this.arg.type)) {
                return "boolean"
            } else if (_.contains(["java.lang.String[]", "long[]"], this.arg.type)) {
                return this.arg.type;
            } else if (this.isNumber(this.arg.type)) {
                return "number";
            } else {
                return "simple";
            }
        }

        this.isBoolean = function(type){
            if (type === "boolean" || type === "java.lang.Boolean") {
                return true;
            }
            return false;
        }

        this.isNumber = function(type){
            if (type === "long" || type === "double" || type === "int") {
                return true;
            }
            return false;
        }

        this.pushToArray = function(val){
            if (val === "" || typeof val === "undefined" || val === null) {
                return;
            }
            if (!_.isArray($ctrl.arg.value)) {
                $ctrl.arg.value = [];
            }
            $ctrl.arg.value.push(val);
            $ctrl.arrayInput = null;
        }

        this.removeFromArray = function(idx){
            if (idx > -1) {
                $ctrl.arg.value.splice(idx, 1);
            }
        }
    }
});
