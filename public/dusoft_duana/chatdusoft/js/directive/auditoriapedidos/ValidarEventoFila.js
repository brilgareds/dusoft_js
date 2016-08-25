
define(["angular","js/directive"], function(angular, directive){

    directive.directive('validarEventoFila', function() {

        var directive = {};
        //directive.transclude = 'true';
        //directive.replace = true;
        //directive.require = "ngModel";
        //directive.restrict = 'E';


        directive.controller = ["$scope",function($scope){
          
            $scope.$parent.$parent.esEventoPropagadoPorFila = function(event){
               
                if($(event.target).hasClass("ngCellText")){
                   
                    return true;
                } else {
                    return false;
                }
                
            };
        }];

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){

        };

        return directive;
            
    });

});
