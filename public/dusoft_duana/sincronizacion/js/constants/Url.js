define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'SINCRONIZACION_DOCUMENTOS': {
                "LISTAR_PREFIJOS": BASE_URL + "/SincronizacionDocumentos/listarPrefijos",
                "INSERTAR_TIPO_CUENTA": BASE_URL + "/SincronizacionDocumentos/insertTipoCuentas",
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
