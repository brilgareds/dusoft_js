define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'VALIDACIONDESPACHOS': {
                "LISTAR_EMPRESAS": BASE_URL + "/ValidacionDespachos/listarempresas",
                "LISTAR_DESPACHOS_APROBADOS": BASE_URL + "/ValidacionDespachos/listarDespachosAprobados"
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
