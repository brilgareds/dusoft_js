define(["angular"], function(angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'RADICACION': {
             'LISTAR_CONCEPTO': BASE_URL + "/Radicacion/listarConcepto",
             
            'GUARDAR_CONCEPTO': BASE_URL + "/Radicacion/guardarConcepto"
            },
            'BODEGAS' : {
                'LISTAR_BODEGA_DUANA_FARMACIA' : BASE_URL + "/Bodegas/listar_bodegas_duana_farmacias"
            }
          
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
