define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'CONTRATOS': {
                'LISTAR_PRODUCTOS_CONTRATO': BASE_URL + '/Auditorias/Contratos/listarProductosContrato',
                'DESCARGAR_PRODUCTOS_CONTRATO': BASE_URL + '/Auditorias/Contratos/descargarProductosContrato'
            }
        }



    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
