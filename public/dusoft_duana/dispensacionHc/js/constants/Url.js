define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
           
            'DISPENSACIONHC':{
                
                "LISTAR_FORMULAS": BASE_URL + "/DispensacionHc/listarFormulas",
                "LISTAR_TIPO_DOCUMENTO": BASE_URL + "/DispensacionHc/listarTipoDocumento",
                "LISTAR_FORMULAS_PENDIENTES": BASE_URL + "/DispensacionHc/listarFormulasPendientes",
                "LISTAR_MEDICAMENTOS_FORMULADOS": BASE_URL + "/DispensacionHc/listarMedicamentosFormulados",
                "CONSULTAR_MEDICAMENTOS_DESPACHADOS": BASE_URL + "/DispensacionHc/consultarMedicamentosDespachados",
                "CANTIDAD_PRODUCTO_TEMPORAL": BASE_URL + "/DispensacionHc/cantidadProductoTemporal",
                "EXISTENCIAS_BODEGAS": BASE_URL + "/DispensacionHc/existenciasBodegas",
                "TEMPORAL_LOTES": BASE_URL + "/DispensacionHc/temporalLotes",
                "LISTAR_MEDICAMENTOS_TEMPORALES": BASE_URL + "/DispensacionHc/listarMedicamentosTemporales",
                "ELIMINAR_MEDICAMENTOS_TEMPORALES": BASE_URL + "/DispensacionHc/eliminarTemporalFormula",
                "LISTAR_TIPO_FORMULA": BASE_URL + "/DispensacionHc/listarTipoFormula",
                "REALIZAR_ENTREGA_FORMULA": BASE_URL + "/DispensacionHc/realizarEntregaFormula",
                "LISTAR_MEDICAMENTOS_PENDIENTES_POR_DISPENSAR": BASE_URL + "/DispensacionHc/listarMedicamentosPendientesPorDispensar",
                "LISTAR_MEDICAMENTOS_DISPENSADOS": BASE_URL + "/DispensacionHc/listarMedicamentosDispensados",
                "USUARIO_PRIVILEGIOS": BASE_URL + "/DispensacionHc/usuarioPrivilegios",
                "AUTORIZAR_DISPENSACION_MEDICAMENTO": BASE_URL + "/DispensacionHc/autorizarDispensacionMedicamento"
              
               
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
