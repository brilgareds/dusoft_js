
define(["angular", "js/services"], function(angular, services) {

    services.factory('GestionTercerosService', 
    ['$rootScope','Modulo','Request','API',
    function($rootScope, Modulo, Request, API) {
        
        var self = this;

        self.obtenerParametrizacionTerceros = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.OBTENER_PARAMETRIZACION_FORMULARIO, "POST", parametros, function(data) {
                    
                callback(data);

             });
        };
        
        self.obtenerPaises = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_PAISES, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.obtenerDepartamentosPorPais = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_DEPARTAMENTOS_POR_PAIS, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        
        self.obtenerCiudadesPorDepartamento = function(parametros, callback ){

             Request.realizarRequest(API.UBICACION.LISTAR_CIUDADES_POR_DEPARTAMENTO, "POST", parametros, function(data) {
                   
                callback(data);

             });
        };
        

        return this;

     }]);
});