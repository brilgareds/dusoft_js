
define(["angular","js/directive", "includes/components/chat/ChatController"], function(angular, directive){

    directive.directive('chat', [function() {

        var directive = {};
        
        //directive.replace = true;
        directive.restrict = 'E';
        directive.templateUrl = "../includes/components/chat/Chat.html";
        var self = this;
        
        directive.scope = {

        };

        directive.controller = "ChatController";

        //cuando la etiqueta esta cargada en el dom
        directive.link = function(scope, element, attrs, ngModel){
            
            $(document).on("click",".indicadorScrollChat",function(){
                self.realizarScrollInferior();
            });
            
            
            $(document).on('scroll', '.panelConversacion', function() {
                console.log('scrolling'); // you *really* don't want to alert in a scroll
            });
            
            $(".panelConversacion").scroll(function() {
               console.log('scroll happened');
            });
            
            scope.$on("onTabConversaciones",function(){
                var tab = $(".headerConversaciones");
                
                if(tab.hasClass("blink")){
                    tab.removeClass("blink");
                }
            });
            
            scope.$on("onMensajeNuevo",function(e, mensaje, usuario){
                console.log("on mensaje nuevo >>>>>>>>>>>>>>>>>>>>", mensaje, usuario);
                self.realizarScrollSiEsNecesario();
                
                //Valida que no sea el usuario que emitio el mensaje
                if(mensaje.usuario !== usuario.getNombreUsuario()){
                    
                    if(!$(".tabConversaciones").hasClass("active")){
                        $(".headerConversaciones").addClass("blink");
                    }
                }
                
            });
                 
            scope.$on("realizarScrollInferior",function(){
                self.realizarScrollInferior();
                
            });
            
            self.realizarScrollInferior = function(){
                var panel = $(".panelConversacion");
                panel.animate({ scrollTop: panel.prop("scrollHeight")}, 200);
            };
            
            self.realizarScrollSiEsNecesario = function(){
                var panel = $(".panelConversacion");
                if (self.obtenerDiferenciaScroll() <= 4) {
                    panel.animate({ scrollTop: panel.prop("scrollHeight")}, 500);
                }
            };
            
            self.obtenerDiferenciaScroll = function(){
                var panel = $(".panelConversacion");
                var scrollActual =  panel.outerHeight();
                var total = ((panel[0]) ? panel[0].scrollHeight : 0) - panel.scrollTop();
                var diferencia = total / scrollActual;
                                
                return diferencia;
            };
            
            
            scope.onErrorImagen = function(img){
                var time = setTimeout(function(){
                    img.src = "/images/noImage.gif";
                    clearTimeout(time);
                }, 0);
                
            };
            

        };

        return directive;
            
    }]);

});
