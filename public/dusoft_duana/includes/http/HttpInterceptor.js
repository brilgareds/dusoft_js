define(["angular","js/services"], function(angular, services){
    services.factory('HttpInterceptor', ["$q","Usuario", function ($q, Usuario) {
        return {
            'response':function(response){
                var auth = true;
                if(response.headers()['content-type'] === "application/json; charset=utf-8" && auth){

                    //el usuario actual no esta autenticado en el api, el token no es valido
                    if(response.data.status === 401){

                         window.location = "../pages/"+response.data.status+".html";
                         return;
                    }

                }

                return response;
            },
            'request':function(config){
                
                if(config.data && config.data.session){
                    var usuario = Usuario.getUsuarioActual() || null;
                    var modulo = (usuario) ? usuario.getModuloActual() : null;
                    config.data.session.moduloActual = (modulo && modulo.alias) ? modulo.alias : "";
                }
                
                return config;
            }
        };
    }]);

});
