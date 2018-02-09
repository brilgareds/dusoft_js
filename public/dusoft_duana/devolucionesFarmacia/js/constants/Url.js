define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'DEVOLUCIONESFARMACIA': {
                "LISTAR_EMPRESAS": BASE_URL + "/DevolucionesFarmacia/listarempresas",
                /*"MODIFICAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/DevolucionesFarmacia/modificarAutorizacionProductos",
                "INSERTAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/DevolucionesFarmacia/insertarAutorizacionProductos",
                "VERIFICAR_AUTORIZACION_PRODUCTOS": BASE_URL + "/DevolucionesFarmacia/verificarAutorizacionProductos",
                "LISTAR_VERIFICACION_PRODUCTOS": BASE_URL + "/DevolucionesFarmacia/listarVerificacionProductos",*/
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});