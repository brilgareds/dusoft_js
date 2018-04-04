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
                "INSERTAR_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/insertarMedicamentoTmp",
                "OBTENER_MEDICAMENTOS_TMP": BASE_URL + "/FormulacionExterna/obtenerMedicamentosTmp",
                "ELIMINAR_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/eliminarMedicamentoTmp",
                "CONSULTA_EXISTE_FORMULA": BASE_URL + "/FormulacionExterna/consultaExisteFormula",
                "OBTENER_LOTES_DE_PRODUCTO": BASE_URL + "/FormulacionExterna/obtenerLotesDeProducto",
                "INSERTAR_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/insertarDispensacionMedicamentoTmp",
                "ELIMINAR_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/eliminarDispensacionMedicamentoTmp",
                "OBTENER_DISPENSACION_MEDICAMENTO_TMP": BASE_URL + "/FormulacionExterna/obtenerDispensacionMedicamentosTmp",
                "GENERAR_ENTREGA": BASE_URL + "/FormulacionExterna/generarEntrega",

            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
