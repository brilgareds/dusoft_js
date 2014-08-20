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

                  //modal del slider
                  var modalslide = $("#contenedormodalslide");

                  if(!modalslide.length > 0){
                    $(document.body).append("<div id='contenedormodalslide'> </div>");
                    modalslide = $("#contenedormodalslide");
                  }

                  //asegura que el slide este cerrado
                  slide.cerrarslide($element, false, modalslide);

                  //emite al menu que ha sido cargado el slide
                  $rootScope.$emit("slidecargado");

                  //determina el margen del slide cuando el menu esta listo
                  $rootScope.$on("configurarslide",function(){
                    slide.configurarSlide($element, modalslide);
                  });

                  //configura el ancho del slide de acuerdo al evento de resize del navegador
                  $( window ).resize(function() {

                    if($(window).width() < 1688){
                      menuWidth = 10;
                    }

                    slide.configurarSlide($element, modalslide);
                  });

                  //coloca el elemento en el body
                  if($(".slide").length == 0){
                    $(document.body).append($element.detach());
                  }
                  

                  $scope.$parent.$on('mostrarslide', function($event) {
                     slide.mostrarslide($element, modalslide);
                  });

                  $rootScope.$on('cerrarslide', function($event, datos) {
                      if(!datos){
                          datos = {animado :false};
                      }
                      slide.cerrarslide($element, datos.animado, modalslide);
                  });
              });  
          },

          configurarSlide : function($element, contenedor){
              var width = $(".contenidoPrincipal").width();
              //console.log("configure slide with width "+width);
              $element.width(width +30);
          },

          mostrarslide: function($element, contenedor){
             $element.animate({"display":"block","right":"-8px"});
             contenedor.show();
          },

          cerrarslide: function($element, animado, contenedor){
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

            contenedor.hide();
            
          }

       };

       return slide;
       
    }]);

});
