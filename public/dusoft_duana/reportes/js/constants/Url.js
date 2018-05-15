define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'REPORTES': {
                "LISTAR_DR_ARIAS": BASE_URL + "/Reportes/DrArias/listarDrArias",
                'CENTROS_UTILIDAD_EMPRESAS':BASE_URL+'/CentrosUtilidad/listarCentrosUtilidadEmpresa',
                'BODEGAS_EMPRESA':BASE_URL+'/Bodegas/listarBodegasEmpresas',
                'LISTAR_EMPRESAS': BASE_URL+"/Empresas/listarEmpresas",
                'LISTAR_PLANES':BASE_URL+'/Reportes/DrArias/listarPlanes',
                "REPORTES_GENERADOS": BASE_URL + "/Reportes/DrArias/reportesGenerados",
                "ROTACION_ZONAS": BASE_URL + "/Reportes/DrArias/rotacionZonas",
                "GENERAR_ROTACIONES": BASE_URL + "/Reportes/DrArias/generarRotaciones"
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
