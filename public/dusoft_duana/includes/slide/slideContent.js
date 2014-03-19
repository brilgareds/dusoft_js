define(["angular","js/directive"], function(angular, directive){

    directive.directive('slideContent',[function() {
       return {
          link:function(scope, element, attrs) {
             var rootWidth = $(window).width() +2000;
              angular.element(document).ready(function(){
                  $(element).css({"right":"-"+rootWidth+"px"});
              });
          },
          
          scope:{
           // datosbusqueda: '=selectsearch'

          },
          controller: function($scope, $element) {
              var rootWidth = $(window).width() + 2000;
              $scope.$parent.$on('mostrarslide', function($event) {
                  $($element).animate({"right":"0px"});
              });

              $scope.$parent.$on('cerrarslide', function($event) {
                  $($element).animate(
                    {"right":"-"+rootWidth+"px"},
                    {

                      complete:function(){

                      }
                    }

                  );
              });
          }


       }
       
    }]);

});
