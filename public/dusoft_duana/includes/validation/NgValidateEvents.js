define(["angular","js/directive", "includes/slide/transition"], function(angular, directive){

    directive.directive('ngValidateEvents',["$rootScope", "AlertService",function($rootScope, AlertService) {
       var slide =  {
          link:function(scope, element, attrs) {

             var eventos = JSON.parse(attrs.ngValidateEvents);
             
             for(var i in eventos){
                 var valor = eventos[i];
                 //console.log("eventos ", valor)
                 if(!valor){
                     console.log("removiendo ***************************** ", i)
                     element.removeAttr("ng-"+i);
                     element.bind(i, function (e) {
                         AlertService.mostrarMensaje("warning", "El usuario no tiene permisos para realizar esta accion!");
                         e.stopImmediatePropagation();
                         return false;

                     });
                 }
                 
             }
                          
          },
          
          controller: ["$scope", "$element", "$attrs",function($scope, $element, $attrs) {

          }]

       };

       return slide;
       
    }]);

});
