
define(["angular","js/directive"], function(angular, directive){

    directive.directive('inputCheck', function() {

        var directive = {};
        directive.checked = false;
        directive.replace = true;
        directive.require = "ngModel";
        directive.restrict = 'E';
        directive.template ='<button class="btn btn-xs check-btn"  >'+
                        '<span class="glyphicon glyphicon-check"></span>'+
                    '</button>';

        directive.scope = {
          ngModel: '=ngModel'
        };

        //cuando la etiqueta esta cargada en el dom
        directive.link = function($scope, element, attrs, ngModel){
            element.on("click",function(){
                directive.checked = !directive.checked;
                directive.setClass(element);
                ngModel.$setViewValue(directive.checked);
                
            });

           //watch para revisar el cambio del modelo en tiempo real
           $scope.$watch(function () {
              return ngModel.$modelValue;
           }, function(newValue) {
               directive.checked = newValue;
               directive.setClass(element);
           });
        };

        directive.setClass = function(element){
            if(directive.checked){
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
