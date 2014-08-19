define(["angular","js/directive"], function(angular, directive){

    directive.directive('slideContent',["$rootScope",function($rootScope) {
       var slide =  {
          margen: 2000,

          link:function(scope, element, attrs) {
             

          },
          
          scope:{
           // datosbusqueda: '=selectsearch'

          },
          controller: function($scope, $element) {

              angular.element(document).ready(function() {

                  //determina el margen del slide cuando el menu esta listo
                  $rootScope.$on("itemmenuseleccionado",function(){
                    slide.configurarSlide($element);
                  });

                  $( window ).resize(function() {

                    if($(window).width() < 1688){
                      menuWidth = 10;
                    }

                    slide.configurarSlide($element);
                  });

                  //asegura que el slide este cerrado
                  slide.cerrarslide($element, false);

                  var rootWidth = $(window).width() + slide.margen;
                  

                  //coloca el elemento en el body
                  $(document.body).append($element.detach());

                 
                  
                  $scope.$parent.$on('mostrarslide', function($event) {
                     slide.mostrarslide($element);
                  });

                  $scope.$parent.$on('cerrarslide', function($event) {
                      slide.cerrarslide($element, true);
                  });
              });  
          },

          configurarSlide : function($element){
              var width = $(".contenidoPrincipal").width();
              console.log("configure slide with width "+width);
              $element.width(width +30);
          },

          mostrarslide: function($element){
             $($element).animate({"display":"block","right":"-8px"});
          },

          cerrarslide: function($element, animado){
            var rootWidth = $(window).width() +slide.margen
            if(animado){
              $element.animate(
                {"right":"-"+rootWidth+"px"},
                {

                  complete:function(){
                    $element.css("display:none");
                  }
                }

              );
            } else {
              $element.css({"right":"-"+rootWidth+"px", "display":"none"});
            }
            
          }

       };

       return slide;
       
    }]);

});
