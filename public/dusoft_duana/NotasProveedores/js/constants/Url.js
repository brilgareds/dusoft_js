define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'NOTAS_PROVEEDORES': {
                'TIPOS_DOC': BASE_URL + '/notasProveedores/tiposDoc',
                'LISTAR_NOTAS': BASE_URL + '/notasProveedores/listarNotasProveedores'
            }
        }

    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
