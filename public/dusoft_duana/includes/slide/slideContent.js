define(["angular","js/directive", "includes/slide/transition"], function(angular, directive){

    directive.directive('slideContent',["$rootScope",function($rootScope) {
       var slide =  {
          margen: 2000,

          link:function(scope, element, attrs) {
             
             //console.log(attrs)
          },
          
          scope: {
            'closeCallback' : '=',
            'openCallback' : '='
          },
          controller: function($scope, $element, $attrs) {
              console.log("opencallback ",$attrs);
              
              if(($attrs.closeCallback === undefined || $attrs.closeCallback.length == 0) || 
                  ($attrs.openCallback === undefined || $attrs.openCallback.length == 0)){
                 throw "No se han declarado los callbacks para el slide";
                 return;
              }
              
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
                  

                  $scope.$parent.$on($attrs.openCallback, function($event) {
                     slide.mostrarslide($element, modalslide);
                  });

                  $rootScope.$on($attrs.closeCallback, function($event, datos) {
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
              $element.width(width +25);
          },

          mostrarslide: function($element, contenedor){
            console.log("on mostrar slide");
            $element.css({"display":"block"});
            contenedor.show();
            $element.transition({ x: '0px', duration:1000 });
           
          },

          cerrarslide: function($element, animado, contenedor){
            var rootWidth = $(window).width() +slide.margen
            
            $element.transition({ x: rootWidth+"px", duration:1000},function(){
               $element.css({"display":"none"});
               contenedor.hide();
            });

          }

       };

       return slide;
       
    }]);

});
