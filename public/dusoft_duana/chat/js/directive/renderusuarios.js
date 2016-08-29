define(["angular","js/directive"], function(angular, directive){

    directive.directive('renderusuarios',["$rootScope",function($rootScope) {
       return {
          link:function(scope, element, attrs) {
            //se debe esperar que el elemento este listo en el dom
            
            angular.element(document).ready(function(){
                //bug fixed for placeholder
                element = $(element);

               $rootScope.$on("datosrecibidos",function(e,datos,operario){
                  //console.log(datos);
                  for(var i in datos){
                      var obj = datos[i];
                      //console.log(d[i])
                      element.append("<option ng-value='"+obj.id+"' >"+obj.nombre_usuario+"-"+obj.usuario +"</option>")
                  }
               })

               

             });
          }


       }
       
    }]);

});
