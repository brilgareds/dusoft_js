define(["angular","js/services"], function(angular, services){
    services.factory('HttpInterceptor', ["$q", function ($q) {
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
            }
        }
    }]);

});
