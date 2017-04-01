define(["angular","js/directive", "includes/components/chat/ChatController"], function(angular, directive){

    directive.directive('formValidation', ["$rootScope",function($rootScope) {

        var directive = {};
        
        var self = this;
        self.nombreClase = "submitedWithError";

        directive.scope = {

        };
   
        directive.require = '^form';

        
        directive.link = function(scope, element, attrs, ngModel){
            
            /**,
            * @author Eduar Garcia
            * +Descripcion Evento de keyup para los input
            * @params e: {Event}
            * @fecha 2017-03-25
            */
            element.on("keyup", function(e){                                
                var input = $(e.target);   
                scope.gestionarClase(input);
            });
            
            $('input').attr('autocomplete', 'off');
            
            
           /**
            * @author Eduar Garcia
            * +Descripcion Evento de blur para los select
            * @params e: {Event}
            * @fecha 2017-03-25
            */
            $(element).on("blur",".ui-select-container", function(e){
               scope.gestionarClase($(this));
            });
            
            
            /**
            * @author Eduar Garcia
            * +Descripcion Esta funcion es publica para los controladores, permite determinar el estado de los input y select
            * @fecha 2017-03-25
            */
            ngModel.mostrarErrorEnCampos = function(){
                
                element.find(".ui-select-container, input").each(function(){
                    scope.gestionarClase($(this));
                });
            };
            
            /**
            * @author Eduar Garcia
            * +Descripcion Metodo que obtiene el modelo de angular de cada elemento del formulario y verifica si es invalido para entonces agregar la clase de error
            * @params el: {DOM}
            * @fecha 2017-03-24
            */
            scope.gestionarClase = function(el){   

                var modelo = ngModel[el.attr("name")];
                
                if(modelo){
                    if(modelo.$invalid){
                                                
                        scope.onMostrarToolTip(el);
                        el.addClass(self.nombreClase);
                        
                    } else if(modelo.$valid) {
                        el.removeClass(self.nombreClase);
                        el.tooltip("destroy");
                    }
                } else {
                    console.log("model not found ", el.attr("name"), " with model ", ngModel)
                }


            };
            
           /**
            * @author Eduar Garcia
            * +Descripcion Permite mostrar un tooltip con el mensaje de error en el elemento del formulario
            * @params el: {DOM}
            * @fecha 2017-03-28
            */
            scope.onMostrarToolTip = function(el){
                if (!el.next('div.tooltip:visible').length){
                    el.tooltip({trigger:"manual",  animation: false });
                    el.tooltip("show");
                }
            };
           
        };
        


        return directive;
            
    }]);

});

