define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDUCCION': {
                "LISTAR_EMPRESAS": BASE_URL + "/induccion/listarempresas",
                "LISTAR_CENTROS_UTILIDAD": BASE_URL + "/induccion/listarCentroUtilidad"

            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
