define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDEX': {
                'LISTA_DOCUMENTOS_USUARIOS': BASE_URL + '/movBodegas/consultarDocumentosUsuario',
            },
            'I002': {
                'CONSULTAR_PRODUCTOS' : BASE_URL + '/OrdenesCompra/listarProductos'
            },
            'I003': {
            },
            'E007': {
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
