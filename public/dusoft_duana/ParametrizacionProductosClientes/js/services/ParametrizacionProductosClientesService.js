define(["angular", "js/services"], function (angular, services) {

    services.factory('ParametrizacionProductosClientesService',
        ['Request', 'API',
            function (Request, API) {
                const that = this;

                that.post = (url, obj, callback) => {
                    Request.realizarRequest(url, "POST", obj, data => callback(data) );
                };

                return this;
            }
        ]
    );
});
