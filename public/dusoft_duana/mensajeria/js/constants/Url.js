define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'MENSAJES': {
                'LISTAR_MENSAJES_TOTAL': BASE_URL + '/Mensajeria/listarMensajesTotal',
                'CONSULTAR_LECTURAS_MENSAJES': BASE_URL + '/Mensajeria/ConsultarLecturasMensajes'
            }
        }



    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
