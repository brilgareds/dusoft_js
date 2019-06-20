define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'PLANILLAS': {
                'LISTAR_PLANILLAS': BASE_URL + '/PlanillasDespachos/listar',
                'LISTAR_PLANILLAS_DOC': BASE_URL + '/PlanillasDespachos/listarPorDoc',
                'CONSULTAR_PLANILLA': BASE_URL + '/PlanillasDespachos/consultarPlanillaDespacho',
                'DOCUMENTOS_PLANILLA': BASE_URL + '/PlanillasDespachos/consultarDocumentosPlanillaDespacho',
                'GENERAR_PLANILLA': BASE_URL + '/PlanillasDespachos/generarPlanillaDespacho',
                'INGRESAR_DOCUMENTOS': BASE_URL + '/PlanillasDespachos/ingresarDocumentosPlanilla',
                'ELIMINAR_DOCUMENTO': BASE_URL + '/PlanillasDespachos/eliminarDocumentoPlanilla',
                'DESPACHAR_PLANILLA': BASE_URL + '/PlanillasDespachos/despacharPlanilla',
                'MODIFICAR_PLANILLA': BASE_URL + '/PlanillasDespachos/modificarPlanilla',
                'LISTAR_DOCUMENTOS_FARMACIAS': BASE_URL + '/PlanillasDespachos/documentosDespachosPorFarmacia',
                'LISTAR_DOCUMENTOS_CLIENTES': BASE_URL + '/PlanillasDespachos/documentosDespachosPorCliente',
                'REPORTE_PLANILLA_DESPACHO': BASE_URL + '/PlanillasDespachos/reportePlanillaDespacho',
                'MODIFICAR_DOCUMENTO_PLANILLA':BASE_URL + '/PlanillasDespachos/modificarDocumentoPlanilla',
                'CANTIDADES_CAJA_NEVERA': BASE_URL + '/PlanillasDespachos/consultarCantidadCajaNevera',
                'GESTIONAR_LIOS': BASE_URL + '/PlanillasDespachos/gestionarLios',
                'MODIFICAR_LIOS': BASE_URL + '/PlanillasDespachos/modificarLios',
                'LISTAR_DOCUMENTOS_OTRAS_SALIDAS' : BASE_URL + '/ValidacionDespachos/listarDocumentosOtrasSalidas',
                'LISTAR_NUMERO_PREFIJO_OTRAS_SALIDAS' : BASE_URL + '/ValidacionDespachos/listarNumeroPrefijoOtrasSalidas'
            },
            'CIUDADES': {
                'LISTAR_CIUDADES': BASE_URL + '/Ciudades/listar'
            },
            'TRANSPORTADORAS': {
                'LISTAR_TRANSPORTADORAS': BASE_URL + '/Transportadoras/listar'
            },
            'CENTROS_UTILIDAD': {
                'LISTAR_CENTROS_UTILIDAD': BASE_URL + '/CentrosUtilidad/listarCentrosUtilidadbodega',
                'LISTAR_FARMACIAS_TERCEROS': BASE_URL + '/CentrosUtilidad/listarFarmaciasTerceros'
            },
            'CLIENTES': {
                'LISTAR_CLIENTES': BASE_URL + '/Terceros/Clientes/listarClientesCiudad'
            },
            
            
             /**
             * @author Cristian Ardila
             * +Descripcion: 
             */
            'PLANILLAS_FARMACIAS': {
                'LISTAR_PLANILLAS_FARMACIAS': BASE_URL + '/PlanillasFarmacias/listar',
                'LISTAR_DOCUMENTOS': BASE_URL + '/PlanillasFarmacias/listarDocumentos',
                'GENERAR_PLANILLA_FARMACIA':BASE_URL + '/PlanillasFarmacias/generarPlanillaFarmacia',
                'INGRESAR_DOCUMENTO_FARMACIA':BASE_URL + '/PlanillasFarmacias/ingresarDocumentoFarmacia',
                'DESPACHAR_PLANILLA': BASE_URL + '/PlanillasFarmacias/despacharPlanilla',
                'CONSULTAR_PLANILLA': BASE_URL + '/PlanillasFarmacias/consultarPlanillaFarmacia',
                'DOCUMENTOS_PLANILLA': BASE_URL + '/PlanillasFarmacias/consultarDocumentosPlanillaFarmacia',
                'ELIMINAR_DOCUMENTO': BASE_URL + '/PlanillasFarmacias/eliminarDocumentoPlanillaFarmacia'                               
                                 
              
            },
            'FARMACIAS': {
                'LISTAR_FARMACIAS': BASE_URL + '/Ciudades/listar'
            },
        }
        
        
         
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
