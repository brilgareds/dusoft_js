define(["angular"], function (angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'RADICACION': {
                'LISTAR_CONCEPTO': BASE_URL + "/Radicacion/listarConcepto",

                'LISTAR_FACTURA': BASE_URL + "/Radicacion/listarFactura",

                'GUARDAR_CONCEPTO': BASE_URL + "/Radicacion/guardarConcepto",

                'GUARDAR_FACTURA': BASE_URL + "/Radicacion/guardarFactura",
                
                'SUBIR_ARCHIVO': BASE_URL + "/Radicacion/subirArchivo"
            },
            'BODEGAS': {
                'LISTAR_BODEGA_DUANA_FARMACIA': BASE_URL + "/Bodegas/listar_bodegas_duana_farmacias"
            }

        }
    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });

    return Url;
});
