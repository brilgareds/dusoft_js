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
                'REGISTRO_ENTRADA_BODEGA': BASE_URL + '/ValidacionDespachos/registroEntradaBodega',
                'MODIFICAR_REGISTRO_ENTRADA_BODEGA': BASE_URL + '/ValidacionDespachos/modificarRegistroEntradaBodega',
                'LISTAR_REGISTRO_ENTRADA': BASE_URL + '/ValidacionDespachos/listarRegistroEntrada',
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
            }
        }

    };
    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
