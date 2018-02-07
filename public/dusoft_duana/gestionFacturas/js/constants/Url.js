define(["angular"], function(angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'LOGS': {
                "LISTAR_LOGS": BASE_URL + "/Sistema/listarLogs",
                "LISTAR_LOGS_VERSION": BASE_URL + "/Sistema/listarLogsVersion",
            },
            'VERSION' : {
                "VERIFICAR_SINCRONIZACION": BASE_URL + "/Sistema/verificarSincronizacion",
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
