define(["angular"], function(angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'FORMULACION_EXTERNA': {
                "OBTENER_TIPOS_DOCUMENTO": BASE_URL + "/FormulacionExterna/obtenerTiposDocumento",
                "OBTENER_AFILIADO": BASE_URL + "/FormulacionExterna/obtenerAfiliado",
                "OBTENER_TIPO_FORMULA": BASE_URL + "/FormulacionExterna/obtenerTipoFormula",
                "OBTENER_MUNICIPIOS": BASE_URL + "/FormulacionExterna/obtenerMunicipios",
                "OBTENER_DIAGNOSTICOS": BASE_URL + "/FormulacionExterna/obtenerDiagnosticos",
                "ELIMINAR_DIAGNOSTICO_TMP": BASE_URL + "/FormulacionExterna/eliminarDiagnosticoTmp",
                "OBTENER_DIAGNOSTICOS_TMP": BASE_URL + "/FormulacionExterna/obtenerDiagnosticosTmp",
                "OBTENER_PROFESIONALES": BASE_URL + "/FormulacionExterna/obtenerProfesionales",
                "GUARDAR_DIAGNOSTICO_TMP": BASE_URL + "/FormulacionExterna/insertarDiagnosticoTmp",
                "GUARDAR_FORMULA_TMP": BASE_URL + "/FormulacionExterna/insertarFormulaTmp",
                "OBTENER_FORMULA_EXTERNA_TMP": BASE_URL + "/FormulacionExterna/obtenerFormulaExternaTmp",
                "BUSCAR_PRODUCTOS": BASE_URL + "/FormulacionExterna/buscarProductos",
                "BUSCAR_PRODUCTOS_POR_PRINCIPIO_ACTIVO": BASE_URL + "/FormulacionExterna/buscarProductosPorPrincipioActivo",
                "INSERTAR_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/insertarMedicamentoTmp",
                "OBTENER_MEDICAMENTOS_TMP": BASE_URL + "/FormulacionExterna/obtenerMedicamentosTmp",
                "ELIMINAR_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/eliminarMedicamentoTmp",
                "CONSULTA_EXISTE_FORMULA": BASE_URL + "/FormulacionExterna/consultaExisteFormula",
                "OBTENER_LOTES_DE_PRODUCTO": BASE_URL + "/FormulacionExterna/obtenerLotesDeProducto",
                "INSERTAR_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/insertarDispensacionMedicamentoTmp",
                "INSERTAR_LLAMADAS_PACIENTES": BASE_URL + "/FormulacionExterna/insertarLlamadaPacientes",
                "ELIMINAR_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/eliminarDispensacionMedicamentoTmp",
                "OBTENER_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/obtenerDispensacionMedicamentosTmp",
                "GENERAR_ENTREGA": BASE_URL + "/FormulacionExterna/generarEntrega",
                "GENERAR_ENTREGA_PENDIENTES": BASE_URL + "/FormulacionExterna/generarEntregaPendientes",
                "AUTORIZAR_MEDICAMENTO": BASE_URL + "/FormulacionExterna/updateAutorizacionPorMedicamento",
                "IMPRIMIR_MEDICAMENTOS_PENDIENTES_POR_DISPENSAR": BASE_URL + "/FormulacionExterna/imprimirMedicamentosPendientesPorDispensar",
                "IMPRIMIR_MEDICAMENTOS_DISPENSADOS": BASE_URL + "/FormulacionExterna/imprimirMedicamentosDispensados",
                "IMPRIMIR_MEDICAMENTOS_PENDIENTES_DISPENSADOS": BASE_URL + "/FormulacionExterna/imprimirMedicamentosPendientesDispensados",
                "BUSCAR_FORMULAS": BASE_URL + "/FormulacionExterna/buscarFormulas",
                "LISTAR_LLAMADAS_PACIENTES": BASE_URL + "/FormulacionExterna/listarLlamadasPacientes",
                "LISTAR_MEDICAMENTOS_PENDIENTES": BASE_URL + "/FormulacionExterna/listarMedicamentosPendientes",
                "INACTIVAR_PENDIENTE": BASE_URL + "/FormulacionExterna/inactivarPendiente",
                "IMPRIMIR_TODO_DISPENSADO": BASE_URL + "/FormulacionExterna/imprimirTodoDispensado",
                "CAMBIAR_CODIGO_PENDIENTE": BASE_URL + "/FormulacionExterna/cambiarCodigoPendiente",
                "ACTUALIZAR_FORMULA_TMP": BASE_URL + "/FormulacionExterna/actualizarFormulaExternaTmp",
                "GUARDAD_NUEVA_CANTIDAD_PENDIENTE": BASE_URL + "/FormulacionExterna/guardarNuevaCantidadPendiente",
                "MARCAR": BASE_URL + "/FormulacionExterna/marcar",
            },
            'DISPENSACIONHC':{
                "USUARIO_PRIVILEGIOS": BASE_URL + "/DispensacionHc/usuarioPrivilegios"
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
