define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'VALIDACIONDESPACHOS': {
                "LISTAR_EMPRESAS": BASE_URL + "/ValidacionDespachos/listarempresas",
                "LISTAR_DESPACHOS_APROBADOS": BASE_URL + "/ValidacionDespachos/listarDespachosAprobados",
                'CANTIDADES_CAJA_NEVERA': BASE_URL + '/PlanillasDespachos/consultarCantidadCajaNevera',
                'REGISTRAR_APROBACION': BASE_URL + '/ValidacionDespachos/registrarAprobacion',
                'OBTENER_DOCUMENTO': BASE_URL + '/movBodegas/E008/obtenerDocumento',
                'CONSULTAR_DOCUMENTOS_USUARIOS': BASE_URL + '/movBodegas/consultarDocumentosUsuario',
                'CONSULTAR_DOCUMENTO_APROBADO': BASE_URL + '/ValidacionDespachos/validarExistenciaDocumento',
                'ADJUNTAR_IMAGEN': BASE_URL + '/ValidacionDespachos/adjuntarImagen',
                'LISTAR_IMAGENES': BASE_URL + '/ValidacionDespachos/listarImagenes',
                'ELIMINAR_IMAGEN': BASE_URL + '/ValidacionDespachos/eliminarImagen',
                'LISTAR_DOCUMENTOS_FARMACIAS': BASE_URL + '/PlanillasDespachos/documentosDespachosPorFarmacia',
                'LISTAR_DOCUMENTOS_CLIENTES': BASE_URL + '/PlanillasDespachos/documentosDespachosPorCliente',
                'REGISTRO_ENTRADA_BODEGA': BASE_URL + '/ValidacionDespachos/registroEntradaBodega',
                'REGISTRO_SALIDA_BODEGA': BASE_URL + '/ValidacionDespachos/registroSalidaBodega',
                'MODIFICAR_REGISTRO_SALIDA_BODEGA': BASE_URL + '/ValidacionDespachos/modificarRegistroSalidaBodega',
                'MODIFICAR_REGISTRO_ENTRADA_BODEGA': BASE_URL + '/ValidacionDespachos/modificarRegistroEntradaBodega',
                'LISTAR_REGISTRO_ENTRADA': BASE_URL + '/ValidacionDespachos/listarRegistroEntrada',
                'LISTAR_REGISTRO_SALIDA': BASE_URL + '/ValidacionDespachos/listarRegistroSalida',
            },
            'CENTROS_UTILIDAD': {
                'LISTAR_CENTROS_UTILIDAD': BASE_URL + '/CentrosUtilidad/listarCentrosUtilidadbodega',
            },
            'CLIENTES':{
                'LISTAR_CLIENTES': BASE_URL + '/Terceros/Clientes/listarClientesCiudad'
            },
            'SINCRONIZACION_DOCUMENTOS': {
                "LISTAR_PREFIJOS": BASE_URL + "/SincronizacionDocumentos/listarPrefijosEspecial"
            },
            'TERCEROS': {
                'LISTAR_CLIENTES': BASE_URL + "/Terceros/GestionTerceros/listarTerceros",
                'LISTAR_OPERARIOS': BASE_URL + "/Terceros/operariosBodega/listarOperarios",
            },
            'TRANSPORTADORAS': {
                'LISTAR_TRANSPORTADORAS': BASE_URL + '/Transportadoras/listar'
            },
            'CIUDADES': {
                'LISTAR_CIUDADES_PAIS': BASE_URL + '/Ciudades/listarCiudadesPais'
            },
            'PLANILLAS':{
                'DOCUMENTOS_PLANILLA': BASE_URL + '/PlanillasDespachos/consultarDocumentosPlanillaDespacho',   
                'DOCUMENTOS_PLANILLA_DETALLE': BASE_URL + '/PlanillasDespachos/consultarDocumentosPlanillaDespachoDetalle',   
            }            
        }

    };
    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
