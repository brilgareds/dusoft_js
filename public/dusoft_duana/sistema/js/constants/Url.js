define(["angular"], function(angular) {
    let Url = angular.module('Url', []);
    let BASE_URL = "/api";
    let data = {
        'API': {
            'BASE_URL': BASE_URL,
            'LOGS': {
                "LISTAR_LOGS": BASE_URL + "/Sistema/listarLogs",
                "LISTAR_LOGS_VERSION": BASE_URL + "/Sistema/listarLogsVersion",
                'SSH': BASE_URL + '/Sistema/sshConnection',
                'QUERYSACTIVES': BASE_URL + '/Sistema/querysActiveInDb'
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
