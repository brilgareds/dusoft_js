define(["angular","js/directive"], function(angular, directive){

    directive.directive('selectsearch',[function(timer, $state) {
       return {
          link:function(scope, element, attrs) {
            //se debe esperar que el elemento este listo en el dom
            
            angular.element(document).ready(function(){
                //bug fixed for placeholder
                element = $(element);
                //element.prepend("<option></option>");

                element.select2({
                    placeholder: scope.selectplaceholder || "Seleccionar..."
                 });

                 element.on("select2-selecting",function(e){
                    if(scope.someCtrlFn){
                      scope.someCtrlFn({valor:e.object.id});
                      element.blur();
                    }
                    
                 });
             });
          },
          
          scope:{
           // datosbusqueda: '=selectsearch'
            defaultoption: "@defaultoption",
            selectplaceholder:"@selectplaceholder",
            someCtrlFn:"&onvalueChange"
          }


       }
       
    }]);

});
