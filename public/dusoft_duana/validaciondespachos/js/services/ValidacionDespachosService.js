define(["angular", "js/services"], function(angular, services) {


    services.factory('ValidacionDespachosService', 
                    ['$rootScope', 'Request', 'API',
                     "Usuario","$modal","localStorageService",
        function($rootScope, Request, API,
                 $modal, Usuario,localStorageService) {

            var self = this;
            
            /*
             * @Author: Eduar
             * @param {Boolean} esTemporal
             * @param {function} callback
             * +Descripcion: Trae los pedidos asignados al tercero o los que estan en separacion
             */
            self.listarDespachosAprobados = function(obj, callback) {
                
                var params = {
                            session: obj.session,
                            data: {
                                validacionDespachos: {
                                    prefijo: obj.prefijo,
                                    numero: obj.numero,
                                    empresa_id: obj.empresa_id,
                                    fechaInicial: obj.fechaInicial,
                                    fechaFinal: obj.fechaFinal,
                                    paginaActual: obj.paginaactual
                                    
                                }
                            }
                        };
                        
                        Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DESPACHOS_APROBADOS, "POST", params, function(data) {
                         
                                callback(data);
                              
                        });
                        
                      
            };
            
           
            return this;
        }]);
});



