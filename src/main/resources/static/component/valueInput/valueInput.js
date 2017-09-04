angular.module("jolokiaWeb").component('valueInput', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/valueInput/valueInput.html';
    },
    bindings: {
        arg: '='
    },
    controller: function($scope, UtilService) {
        var self = this;
        this.$onInit = function(){
            if (UtilService.isBoolean(self.arg.type) && !self.arg.value) {
                self.arg.value = false;
            } else if (UtilService.isArray(self.arg.type)) {
                self.arg.value = [];
            }
        }

        self.isBoolean = function(){ return UtilService.isBoolean(self.arg.type); }
        self.isNumber = function(){ return UtilService.isNumber(self.arg.type); }
        self.isArray = function(){ return UtilService.isArray(self.arg.type); }
        self.isNumberArray = function(){
            return UtilService.isNumber(self.arg.type.replace('[]',''));
        }
        
        this.getType = function(){
            if (self.isBoolean()) {
                return "boolean"
            } else if (self.isArray()) {
                return "array";
            } else if (self.isNumber()) {
                return "number";
            } else {
                return "simple";
            }
        }

        this.pushToArray = function(val){
            if (val === "" || typeof val === "undefined" || val === null) {
                return;
            }
            if (!_.isArray(self.arg.value)) {
                self.arg.value = [];
            }
            self.arg.value.push(val);
            self.arrayInput = null;
        }

        this.removeFromArray = function(idx){
            if (idx > -1) {
                self.arg.value.splice(idx, 1);
            }
        }
    }
});
