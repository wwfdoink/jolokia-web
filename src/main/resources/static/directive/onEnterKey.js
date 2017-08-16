angular.module("myApp").directive('onEnterKey', function() {
    return function(scope, element, attrs) {
        element.bind("keypress", function(e) {
            if (e.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.onEnterKey, {'e': e});
                });
                e.preventDefault();
            }
        });
    };
});