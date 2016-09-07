
define(["angular","js/directive", "includes/components/chat/ChatController"], function(angular, directive){

    directive.directive('chat', function() {

        var directive = {};
        
        //directive.replace = true;
        directive.restrict = 'E';
        directive.templateUrl = "../includes/components/chat/Chat.html";

        directive.scope = {

        };

        directive.controller = "ChatController";

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){
           // ng-click="onBtnChat()"
           
            $(document).on("click", ".btnOpenChatPanel", function(){
                console.log("kfjdkfjdkfdjkfjk")
            });
            
            
            $(".btnCloseChat").on("click",function(){
                
            });
            
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
