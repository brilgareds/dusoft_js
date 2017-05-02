define(["angular","js/directive"], function(angular, directive){
    
    directive.directive('cambiarFoco', function() {
        return function($scope,elem,attrs) {
            console.log(">>>>>>>>>>>> Cambio de Foco <<<<<<<<<<<<<<<");
            elem.bind('keydown', function(e) {
                console.log(">>>>>>>",e);
                that = this;
                var code = e.keyCode || e.which;
                if (code === 13) {
                    console.log(">>>>>>>>>>>> Cambio de Foco INTRO<<<<<<<<<<<<<<<");
                    console.log("CODE: ", code);
                    scope.$apply(function(){
                        e.preventDefault();
                        that.next().focus();
                    });
                    e.preventDefault();
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