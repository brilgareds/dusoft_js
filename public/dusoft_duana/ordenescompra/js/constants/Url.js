define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'ORDENES_COMPRA': {
                'LISTAR_ORDENES_COMPRAS': BASE_URL + '/OrdenesCompra/listarOrdenesCompra',
            },
            'PROVEEDORES': {
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar'
            },
            'UNIDADES_NEGOCIO': {
                'LISTAR_UNIDADES_NEGOCIO': BASE_URL + '/UnidadesNegocio/listarUnidadesNegocio'
            },
            'LABORATORIOS': {
                'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios'
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
