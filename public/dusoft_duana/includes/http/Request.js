define(["angular","js/services"], function(angular, services){
    services.factory('Request',["$http", function ($http) {
            this.realizarRequest = function(url, method, params, callback) {

                var requestObj = {
                    method:method,
                    url:url
                };

                if(method == "GET"){
                    requestObj.params = params;
                } else {
                    requestObj.data = params;
                    requestObj.headers =  {'Content-Type': 'application/json'};
                }


                $http(requestObj).
                    success(function(data, status, headers, config) {
                    callback(data);
                }).
                error(function(data, status, headers, config) {
                    callback(data);
                }); 

            };

            return this;
            
    }]);

});
