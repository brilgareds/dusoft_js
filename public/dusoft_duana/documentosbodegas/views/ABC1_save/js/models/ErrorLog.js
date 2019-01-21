define(["angular", "js/models"], function(angular, models) {

    models.factory('ErrorLog',["$filter", "Request", "API", "Usuario", function($filter, Request, API, Usuario) {
        var session = {
            usuario_id: Usuario.getUsuarioActual().getId(),
            auth_token: Usuario.getUsuarioActual().getToken()
        };
        var obj = {
            session: session,
            data: {
            }
        };

        var ErrorLogs =  {
        	getListaErrorLog : getListaErrorLog
        };

        return ErrorLogs;

        function getListaErrorLog(callback){
            return Request.realizarRequest(API.LOGS.LISTAR_LOGS, "POST", obj, function(data){
            	callback(data.obj.archivos);
            });
        };

    }]);    
});