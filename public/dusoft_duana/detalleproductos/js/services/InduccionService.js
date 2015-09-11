define(["angular", "js/services"], function(angular, services) {


    services.factory('InduccionService', ['$rootScope', 'Request', 'API', "AlertService",
        function($rootScope, Request, API, AlertService) {

            /* $rootScope.$on("evento", function(e, data){
             console.log("esto es un evento", data);
             });*/
            var self = this;

            self.consultarDetalleProducto = function(url,obj,callback) {

                
                Request.realizarRequest(url, "POST", obj, function(data) {
                         
                              callback(data);
                        
                });
            };

            return this;
        }]);
});



