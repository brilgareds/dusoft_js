define(["angular","js/directive", "includes/slide/transition"], function(angular, directive){

    directive.directive('ngValidateEvents',["$rootScope", "AlertService",function($rootScope, AlertService) {
       var validate =  {
          link:function(scope, element, attrs) {
    
             if(!attrs.ngValidateEvents || attrs.ngValidateEvents.length === 0){
                 
                 return;
             }
             
             //Se adiciona un listner para cada evento que desea validarse
             var eventos = JSON.parse(attrs.ngValidateEvents);
             
             for(var i in eventos){
                element.bind(i, function (e) {
                    
                    var valor = obtenerValorEvento(e);
                    
                    if(!valor){
                        AlertService.mostrarMensaje("warning", "El usuario no puede realizar esta accion!");
                        e.stopImmediatePropagation();
                    }
                    

                });
             }
             
             //Esta funcion es necesario, debido a que en ocaciones se necesita esperar que angular traiga valores del Api y validar con ellos los permisos
             //de esta forma obtendremos el valor actual del ng-validate-events
             function obtenerValorEvento(evento){
                
                 for(var i in eventos){
                    if(i === evento.type){
                        var e = JSON.parse(element.attr("ng-validate-events"));
                        return  e[evento.type];
                    }
                 }
             }
                          
          },
          
          controller: ["$scope", "$element", "$attrs",function($scope, $element, $attrs) {

          }]

       };

       return validate;
       
    }]);

});
