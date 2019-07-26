define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'MENSAJES': {
                'LISTAR_MENSAJES_TOTAL': BASE_URL + '/Mensajeria/listarMensajesTotal',
                'CONSULTAR_PERFILES': BASE_URL + '/Mensajeria/consultarPerfiles',
                'CONSULTAR_LECTURAS_MENSAJES': BASE_URL + '/Mensajeria/ConsultarLecturasMensajes',
                'CONSULTAR_MENSAJES_USUARIO': BASE_URL + '/Mensajeria/ConsultarMensajesUsuario',
                'INGRESAR_MENSAJE': BASE_URL + '/Mensajeria/IngresarMensaje'
            }
        }



    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
