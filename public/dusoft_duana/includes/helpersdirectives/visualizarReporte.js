
define(["angular","js/directive"], function(angular, directive){

    directive.directive('visualizarReporte', function() {

        var directive = {};
        //directive.transclude = 'true';
        //directive.replace = true;
        //directive.require = "ngModel";
        directive.restrict = 'E';


        directive.controller = ["$scope",function($scope){
            $scope.$parent.visualizarReporte = function(url, nombre, tipo){
                if(tipo === 'download'){
                    var link = document.createElement("a");
                    link.download = nombre;
                    // Construct the uri
                    var uri = url;
                    link.href = uri;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    delete link;
                } else {
                     window.open(url, tipo);
                }
                
            };
        }];

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){

        };

        return directive;
            
    });

});
