
define(["angular","js/directive"], function(angular, directive){

    directive.directive('selectOnClick', function() {
        
        return {
        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
        
        
        var directive = {};
        directive.restrict = 'A';


        directive.controller = ["$scope",function($scope,element){ 
            $scope.selectOnClick = function(url, nombre, tipo){
                 var focusedElement;
                    element.on('click', function () {
                    if (focusedElement != this) {
                        this.select();
                        focusedElement = this;
                    }
                });
                
                 element.on('blur', function () {
                     focusedElement = null;
                 });
                
            };
        }];

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){

        };

        return directive;
            
    });

});
