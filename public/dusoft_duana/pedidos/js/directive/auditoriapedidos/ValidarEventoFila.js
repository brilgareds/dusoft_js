
define(["angular","js/directive"], function(angular, directive){

    directive.directive('validarEventoFila', function() {

        var directive = {};
        //directive.transclude = 'true';
        //directive.replace = true;
        //directive.require = "ngModel";
        //directive.restrict = 'E';


        directive.controller = ["$scope",function($scope){
            console.log("directive >>>>>>>>>>", $scope)
            $scope.$parent.$parent.esEventoPropagadoPorFila = function(event){
                console.log(event.target);
                if($(event.target).hasClass("ngCellText")){
                    console.log("================row");
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
