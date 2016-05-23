define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'AUTORIZACIONES': {
                "LISTAR_PRODUCTOS_BLOQUEADOS": BASE_URL + "/Autorizaciones/listarProductosBloqueados",
                "MODIFICAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/Autorizaciones/modificarAutorizacionProductos",
                "INSERTAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/Autorizaciones/insertarAutorizacionProductos",
                "VERIFICAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/Autorizaciones/verificarAutorizacionProductos",
                "LISTAR_VERIFICACION_PRODUCTOS": BASE_URL + "/Autorizaciones/listarVerificacionProductos",
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
