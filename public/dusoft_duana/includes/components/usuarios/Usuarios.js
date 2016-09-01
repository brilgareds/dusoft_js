
define(["angular","js/directive", "includes/components/usuarios/UsuariosController"], function(angular, directive){

    directive.directive('usuarios', function() {

        var directive = {};
        
        //directive.replace = true;
        directive.restrict = 'E';
        directive.templateUrl = "../includes/components/usuarios/Usuarios.html";

        directive.scope = {
            btnSeleccionar:"=",
            btnDetalle:"="
        };

        directive.controller = "UsuariosController";

        directive.link = function(scope, element, attrs, ngModel){
            console.log("chat loaded >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
           /* element.on("click",function(){
                //console.log("init with ",scope.checked)
                //console.log("on click" ,!scope.checked )
                scope.checked = !scope.checked;
                directive.setClass(element, scope);
               // ngModel.$setViewValue(scope.checked);
                scope.$apply(function(){
                  ngModel.$setViewValue(scope.checked);
                  //ngModel.$render();
                });                
            });

           //watch para revisar el cambio del modelo en tiempo real
           scope.$watch(function () {
              return ngModel.$modelValue;
           }, function(newValue) {
              console.log("on model change "+newValue)
               scope.checked = newValue;
               directive.setClass(element, scope);
           });
            ngModel.$formatters.push(function(newValue) {

               scope.checked = newValue;
               directive.setClass(element, scope);
           });*/
        };

        return directive;
            
    });

});
