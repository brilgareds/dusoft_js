define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('cambiarFoco', function() {
        return function($scope, elem, attrs, ctrls) {

            elem.bind('focus', function(e) {

                var input = $(this).find("input");
                var button = $(this).find("button");

                if (button.hasClass("btnClick")) {
                    var button = $(this).find(".btnClick");
                    button.focus();
                }

                if (input.hasClass("calendario")) {

                    var button = $(this).find(".btnCalendario");
                    button.trigger("click");

                } else {
                    input.focus();
                }
            });

        };
    });
});

/*define(["angular","js/directive"], function(angular, directive){
    
    directive.directive('cambiarFoco', ['$parse', function($parse) {
        return {
            restrict: 'A',
            require: ['ngModel'],
            link: function(scope, element, attrs, ctrls) {
               var model=ctrls[0], form=ctrls[1];

               scope.next = function(){
                    return model.$valid;
                }

                scope.$watch(scope.next, function(newValue, oldValue){
                    if (newValue && model.$dirty)
                    {
                        var nextinput = element.next('input');
                        if (nextinput.length === 1)
                        {
                            nextinput[0].focus();
                        }
                    }
                });
            }
        };
    }]);

});*/