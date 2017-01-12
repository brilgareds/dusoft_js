
define(["angular","js/directive"], function(angular, directive){

    directive.directive('chatScroll', ["$rootScope",function($rootScope) {

        var directive = {};
        
        //directive.replace = true;
        var self = this;
        var ultimoElemento;

        directive.link = function(scope, element, attrs, ngModel){
            
            element.on("scroll",function(){
                if(element.scrollTop() === 0){
                    ultimoElemento = $(".contenedorDetalle:first").attr("id");
                    
                    scope.$emit("onScrollChat");
                }
            });
            
            scope.$on("onMantenerScroll", function(){
                var contenedor = $("#"+ultimoElemento);
                if(!contenedor || !contenedor.offset()){
                   return;
                }
                
                setTimeout(function(){
                    element.scrollTop(contenedor.offset().top);
                }, 100);
            });

        };

        return directive;
            
    }]);

});
