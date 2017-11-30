
define(["angular","js/directive", "includes/components/chat/ChatController"], function(angular, directive){

    directive.directive('chat', ["$rootScope",function($rootScope) {

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
            
            $("body").removeClass("modal-open");
            
            $(document).on("click",".indicadorScrollChat",function(){
                self.realizarScrollInferior();
            });
            
            
            $(document).on("click", ".toogleChat", function(){
                self.onToogleChat({});
            });
            
            $rootScope.$on("onToogleChat",function(e, data){
                self.onToogleChat(data);
            });
            
            $(document).on('scroll', ".tab-content",function(){
            
            });
            
            
            scope.$on("onTabConversaciones",function(){
                var tab = $(".headerConversaciones");
                var barChat = $(".iconoToogle");
                
                if(tab.hasClass("blink")){
                    tab.removeClass("blink");
                }
                
                if(barChat.hasClass("blink")){
                    barChat.removeClass("blink");
                }
            });
            
            scope.$on("onMensajeNuevo",function(e, mensaje, usuario){
                self.realizarScrollSiEsNecesario();
                
                if($(".contenedorChat").hasClass("chatClosed")){
                    $(".iconoToogle").addClass("blink");
                }
                
                //Valida que no sea el usuario que emitio el mensaje
                if(mensaje.id_conversacion !== $rootScope.conversacionSeleccionada.getId()){
                    
                    if(!$(".tabConversaciones").hasClass("active")){
                        $(".headerConversaciones").addClass("blink");
                    }
                    
                }
                
            });
            
            self.onToogleChat = function(data){
                var contenedorChat = $(".contenedorChat");
                var icono = $(".iconoToogle");
                var iconoAbrir  = "glyphicon glyphicon-chevron-up";
                var iconoCerrar = "glyphicon glyphicon-minus";
                icono.removeClass("blink");
                
                if(!contenedorChat.hasClass("chatClosed") && !data.forzarAbrir){
                    
                    var timer = setTimeout(function(){
                        
                        contenedorChat.removeClass("chatOpened");
                        icono.removeClass(iconoCerrar);
                        contenedorChat.addClass("chatClosed");
                        icono.addClass(iconoAbrir);
                        
                        clearTimeout(timer);
                    }, 0);
                    
                } else {
                    
                    var timer = setTimeout(function(){
                        contenedorChat.removeClass("chatClosed");
                        icono.removeClass(iconoAbrir);
                        contenedorChat.addClass("chatOpened");
                        icono.addClass(iconoCerrar);
                        clearTimeout(timer);
                    }, 0);
                }
            };
                 
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
