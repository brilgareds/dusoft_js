define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL, 
            'PLANILLAS': {
                'GENERAR_PLANILLA': BASE_URL + '/PlanillasDespachos/generarPlanillaDespacho',
                'INGRESAR_DOCUMENTOS': BASE_URL + '/PlanillasDespachos/ingresarDocumentosPlanilla'
            },
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
            'DOCUMENTOS': {
                'LISTAR_DOCUMENTOS_CLIENTES': BASE_URL + '/movBodegas/E008/documentosDespachosPorCliente',
                'LISTAR_DOCUMENTOS_FARMACIAS': BASE_URL + '/movBodegas/E008/documentosDespachosPorFarmacia'
            }
            
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
