define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'AUTORIZACIONES': {
                "LISTAR_PRODUCTOS_BLOQUEADOS": BASE_URL + "/Autorizaciones/listarProductosBloqueados",
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
