
define(["angular", "js/models"], function(angular, models) {

    models.factory('Version',["$filter", "Request", "API", "Usuario", function($filter, Request, API, Usuario) {

        var session = {
            usuario_id: Usuario.getUsuarioActual().getId(),
            auth_token: Usuario.getUsuarioActual().getToken()
        };

        var obj = {
            session: session,
            data: {
            }
        };

        var Version = {
            getListaVersiones : getListaVersiones,
            verificarSincronizacion : verificarSincronizacion
        };

        return Version;

        function getListaVersiones(pagina ,callback){
            obj.data.pagina = pagina;
            return Request.realizarRequest(API.LOGS.LISTAR_LOGS_VERSION, "POST", obj, function(data){
                callback(data.obj.lista_logs_version);
            });
        };

        function verificarSincronizacion(callback){
           return Request.realizarRequest(API.VERSION.VERIFICAR_SINCRONIZACION, "POST", obj, function(data){
                callback(data.obj);
           }); 
        }
    }]);    
});