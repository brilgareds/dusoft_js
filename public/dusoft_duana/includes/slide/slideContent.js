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

                  //asegura que el slide este cerrado
                  slide.cerrarslide($element, false);

                  //emite al menu que ha sido cargado el slide
                  $rootScope.$emit("slidecargado");

                  //determina el margen del slide cuando el menu esta listo
                  $rootScope.$on("configurarslide",function(){
                    slide.configurarSlide($element);
                  });

                  //configura el ancho del slide de acuerdo al evento de resize del navegador
                  $( window ).resize(function() {

                    if($(window).width() < 1688){
                      menuWidth = 10;
                    }

                    slide.configurarSlide($element);
                  });
                  //coloca el elemento en el body
                  $(document.body).append($element.detach());

                  $scope.$parent.$on('mostrarslide', function($event) {
                     slide.mostrarslide($element);
                  });

                  $rootScope.$on('cerrarslide', function($event, datos) {
                      if(!datos){
                          datos = {animado :false};
                      }
                      slide.cerrarslide($element, datos.animado);
                  });
              });  
          },

          configurarSlide : function($element){
              var width = $(".contenidoPrincipal").width();
              //console.log("configure slide with width "+width);
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
              $element.css({"display":"none","right":"-"+rootWidth+"px"});
            }
            
          }

       };

       return slide;
       
    }]);

});
