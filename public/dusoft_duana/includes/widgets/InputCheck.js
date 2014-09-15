
define(["angular","js/directive"], function(angular, directive){

    directive.directive('inputCheck', function() {

        var directive = {};
        
        directive.replace = true;
        directive.require = "ngModel";
        directive.restrict = 'E';
        directive.template ='<button class="btn btn-xs check-btn"  >'+
                        '<span class="glyphicon glyphicon-check"></span>'+
                    '</button>';

        directive.scope = {

        };

        directive.controller = function($scope){
            $scope.checked = false;
        };

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){
            element.on("click",function(){
                //console.log("init with ",scope.checked)
                //console.log("on click" ,!scope.checked )
                scope.checked = !scope.checked;
                directive.setClass(element, scope);
                console.log("chnage model")
                ngModel.$setViewValue(scope.checked);
                //ngModel.$setModelValue(scope.checked);
                
            });

           //watch para revisar el cambio del modelo en tiempo real
           scope.$watch(function () {
              return ngModel.$modelValue;
           }, function(newValue) {
               // console.log("on model change "+newValue)
               scope.checked = newValue;
               directive.setClass(element, scope);
           });
        };

        directive.setClass = function(element , scope){
            if(scope.checked){
                element.removeClass("btn-default");
                element.addClass("btn-success");
            } else {
                element.removeClass("btn-success");
                element.addClass("btn-default");
            }
        };

        return directive;
            
    });

});
