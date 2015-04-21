define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL, 
            'CIUDADES': {
                'LISTAR_CIUDADES': BASE_URL + '/Ciudades/listar'
            },
            'TRANSPORTADORAS': {
                'LISTAR_TRANSPORTADORAS': BASE_URL + '/Transportadoras/listar'
            },
            'CENTROS_UTILIDAD': {
                'LISTAR_CENTROS_UTILIDAD': BASE_URL + '/CentrosUtilidad/listarCentrosUtilidadCiudad'
            },
            'CLIENTES': {
                'LISTAR_CLIENTES': BASE_URL + '/Terceros/Clientes/listarClientesCiudad'
            },
            
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
