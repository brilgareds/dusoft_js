
define(["angular","js/directive"], function(angular, directive){

    directive.directive('validacionNumeroEntero', function() {
        return function(scope, element, attrs) {

            var keyCode = [0,8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105];
            
            element.bind("keydown", function(event) {
                            
                
                if($.inArray(event.which,keyCode) == -1) {
                    scope.$apply(function(){
                        //scope.$eval(attrs.onlyNum);
                        event.preventDefault();
                    });
                    event.preventDefault();
                }

            });
        };
    });

    directive.directive('validacionCaracteresEspeciales', function() {
        function link(scope, elem, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue) {
              var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?¡/¿,.°¬´¨-]*$/;
              // if view values matches regexp, update model value
              if (!viewValue){
                return null;
              }
              if (viewValue.match(reg)) {
                return viewValue;
              }
              // keep the model value as it is
              var transformedValue = ngModel.$modelValue;
              ngModel.$setViewValue(transformedValue);
              ngModel.$render();
              return transformedValue;
            });
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };      
    });

});
