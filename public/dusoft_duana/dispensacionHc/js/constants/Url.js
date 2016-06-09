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
               
            },
            
            'DISPENSACIONHC':{
                
                "LISTAR_FORMULAS": BASE_URL + "/DispensacionHc/listarFormulas",
                "LISTAR_TIPO_DOCUMENTO": BASE_URL + "/DispensacionHc/listarTipoDocumento",
                "LISTAR_FORMULAS_PENDIENTES": BASE_URL + "/DispensacionHc/listarFormulasPendientes",
                "LISTAR_MEDICAMENTOS_FORMULADOS": BASE_URL + "/DispensacionHc/listarMedicamentosFormulados",
                "CANTIDAD_PRODUCTO_TEMPORAL": BASE_URL + "/DispensacionHc/cantidadProductoTemporal",
                "EXISTENCIAS_BODEGAS": BASE_URL + "/DispensacionHc/existenciasBodegas",
                "TEMPORAL_LOTES": BASE_URL + "/DispensacionHc/temporalLotes",
                "LISTAR_MEDICAMENTOS_TEMPORALES": BASE_URL + "/DispensacionHc/listarMedicamentosTemporales",
                "ELIMINAR_MEDICAMENTOS_TEMPORALES": BASE_URL + "/DispensacionHc/eliminarTemporalFormula",
                "LISTAR_TIPO_FORMULA": BASE_URL + "/DispensacionHc/listarTipoFormula"
               
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
