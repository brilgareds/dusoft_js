define(["angular","js/directive"], function(angular, directive){

    directive.directive('slideContent',[function() {
       return {
          link:function(scope, element, attrs) {

          },
          
          scope:{
           // datosbusqueda: '=selectsearch'

          },
          controller: function($scope, $element) {
              $scope.$parent.$on('mostrarkardex', function($event) {
                  $($element).animate({"right":"0px"});
              });

              $scope.$parent.$on('cerrarkardex', function($event) {
                  $($element).animate({"right":"-2000px"});
              });
          }


       }
       
    }]);

});
