define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDUCCION': {
                "LISTAR_EMPRESAS": BASE_URL + "/induccion/listarempresas",
                "LISTAR_CENTROS_UTILIDAD": BASE_URL + "/induccion/listarCentroUtilidad",
                "LISTAR_BODEGAS": BASE_URL + "/induccion/listarBodega",
                "LISTAR_PRODUCTOS": BASE_URL + "/induccion/listarProducto",
                "IMPRIMIR_PRODUCTOS": BASE_URL + "/induccion/imprimirRotulo"
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
