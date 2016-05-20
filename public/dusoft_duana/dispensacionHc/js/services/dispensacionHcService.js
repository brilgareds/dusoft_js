define(["angular", "js/services"], function(angular, services) {


    services.factory('dispensacionHcService', 
                    ['$rootScope', 'Request', 'API',
                     "Usuario","$modal","localStorageService",
        function($rootScope, Request, API,
                 $modal, Usuario,localStorageService) {

            var self = this;
            
            /*
             * @Author: Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion: lista todos los despachos aprobados por parte del 
             *               personal de seguridad
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
                                    paginaActual: obj.paginaactual,
                                    registroUnico: obj.registroUnico
                                    
                                }
                            }
                        };
                       
                        Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DESPACHOS_APROBADOS, "POST", params, function(data){ 
                            
                                callback(data);                              
                        });    
                };   
                
                
            /*
             * @Author: Cristian Ardila
             * @fecha 05/02/2016
             * +Descripcion: consulta todas las empresas de acuerdo al texto
             *               ingresado
             */   
            self.listarEmpresas = function(session,termino_busqueda_empresa,callback) {
                   var obj = {
                       session: session,
                       data: {
                           listar_empresas: {
                               pagina: 1,
                               empresaName: termino_busqueda_empresa
                           }
                       }
                   };
                   Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                        
                           callback(data);                 
                   });
               };
               
             /**
              * +Descripcion Consulta todas las formulas
              */
             self.listarFormulas = function(session, terminoBusqueda, callback){
                 
                 var obj = {
                     session: session,
                     data: {
                        listar_formulas:{
                            pagina: 1,
                            empresa:terminoBusqueda
                        }
                     }
                 };
                 Request.realizarRequest(API.DISPENSACIONHC.LISTAR_FORMULAS,"POST", obj, function(data){
                      
                        callback(data);
                 });
             };
             
             /**
              * @author Cristian Ardila
              * @fecha  20/05/2016
              * +Descripcion Servicio que lista los tipos de documentos
              */
             self.listarTipoDocumentos = function(session, callback){
                 
                var obj = {
                     session: session,
                              data: {
                        listar_formulas:{
                           
                        }
                     }
                };
                
                Request.realizarRequest(API.DISPENSACIONHC.LISTAR_TIPO_DOCUMENTO,"POST", obj, function(data){
                      
                        callback(data);
                });
             };
             
                 return this;
        }]);
});



