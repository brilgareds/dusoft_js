
define(["angular", "js/services"], function(angular, services) {

    services.factory('GestionTercerosService', 
    ['$rootScope','Modulo','Request','API',
    function($rootScope, Modulo, Request, API) {
        
        var self = this;

        self.obtenerParametrizacionTerceros = function(parametros, callback ){

             Request.realizarRequest(API.TERCEROS.OBTENER_PARAMETRIZACION_FORMULARIO, "POST", parametros, function(data) {
                if (data.status === 200) {
                    console.log(">>>>>>>>>>>>>> data parametrizacion ", data);
                }

             });
        };


        return this;

     }]);
});