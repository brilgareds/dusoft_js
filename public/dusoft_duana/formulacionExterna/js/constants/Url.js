define(["angular"], function(angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";
    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'FORMULACION_EXTERNA': {
                "OBTENER_TIPOS_DOCUMENTO": BASE_URL + "/FormulacionExterna/obtenerTiposDocumento",
                "OBTENER_PACIENTE": BASE_URL + "/FormulacionExterna/obtenerPaciente",
                "OBTENER_TIPO_FORMULA": BASE_URL + "/FormulacionExterna/obtenerTipoFormula",
                "OBTENER_MUNICIPIOS": BASE_URL + "/FormulacionExterna/obtenerMunicipios",
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });

    return Url;
});
