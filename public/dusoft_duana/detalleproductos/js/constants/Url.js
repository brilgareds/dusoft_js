define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDUCCION': {
                "LISTAR_EMPRESAS":BASE_URL+"/Induccion/listar/empresas",
                "LISTAR_CENTRO_UTILIDADES":BASE_URL+"/Induccion/listar/centroutilidad",
                "LISTAR_BODEGAS":BASE_URL+"/Induccion/listar/bodegas",
                "LISTAR_PRODUCTOS":BASE_URL+"/Induccion/listar/productos"
            }
        }

    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
