define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'VALIDACIONDESPACHOS': {
                "LISTAR_EMPRESAS": BASE_URL + "/ValidacionDespachos/listarempresas",
                "LISTAR_DESPACHOS_APROBADOS": BASE_URL + "/ValidacionDespachos/listarDespachosAprobados",
                'CANTIDADES_CAJA_NEVERA': BASE_URL + '/PlanillasDespachos/consultarCantidadCajaNevera',
                'REGISTRAR_APROBACION': BASE_URL + '/ValidacionDespachos/registrarAprobacion',
                'OBTENER_DOCUMENTO': BASE_URL + '/movBodegas/E008/obtenerDocumento'
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
