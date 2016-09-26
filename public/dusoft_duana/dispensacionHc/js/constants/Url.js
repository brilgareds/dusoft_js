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
                "LISTAR_MEDICAMENTOS_FORMULADOS_PENDIENTES": BASE_URL + "/DispensacionHc/listarMedicamentosFormuladosPendientes",
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
                //PDF
                "LISTAR_TODOS_MEDICAMENTOS_DISPENSADOS": BASE_URL + "/DispensacionHc/listarTodoMedicamentosDispensados",
                "LISTAR_TOTAL_DISPENSACIONES_FORMULA": BASE_URL + "/DispensacionHc/listarTotalDispensacionesFormula",
                "LISTAR_ULTIMA_DISPENSACIONE_PENDIENTES": BASE_URL + "/DispensacionHc/listarUltimaDispensacionPendientes",
                 
                
                "USUARIO_PRIVILEGIOS": BASE_URL + "/DispensacionHc/usuarioPrivilegios",
                "AUTORIZAR_DISPENSACION_MEDICAMENTO": BASE_URL + "/DispensacionHc/autorizarDispensacionMedicamento",
                "REGISTRAR_EVENTO": BASE_URL + "/DispensacionHc/registrarEvento",
                "REALIZAR_ENTREGA_FORMULA_PENDIENTES": BASE_URL + "/DispensacionHc/realizarEntregaFormulaPendientes",
                "GUARDAR_TODO_PENDIENTES": BASE_URL + "/DispensacionHc/guardarTodoPendiente",
                "DESCARTAR_PRODUCTO_PENDIENTE": BASE_URL + "/DispensacionHc/descartarProductoPendiente",
                "LISTAR_REGISTRO_DE_EVENTOS": BASE_URL + "/DispensacionHc/listarRegistroDeEventos",
              
               
            }
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
