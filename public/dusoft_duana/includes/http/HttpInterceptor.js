define(["angular","js/services"], function(angular, services){
    services.factory('HttpInterceptor', ["$q", function ($q) {
        return function (promise) {
            return promise.then(function (response) {
                var auth = true;
                // do something on success
                if(response.headers()['content-type'] === "application/json; charset=utf-8" && auth){

                    //el usuario actual no esta autenticado en el api, el token no es valido
                    if(response.data.status == 401){
                        /*var timer = setTimeout(function(){
                            clearTimeout(timer);
                            window.location = "../pages/"+response.data.status+".html";
                        },500)*/
                         window.location = "../pages/"+response.data.status+".html";
                    }
                    //return $q.reject(response);

                }
                return response;
            }, function (response) {
                // do something on error
                return $q.reject(response);
            });
        };
    }]);

});
