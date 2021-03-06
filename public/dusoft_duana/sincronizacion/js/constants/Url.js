define(["angular"], function(angular) {
    var Url = angular.module('Url', []);
    var BASE_URL = "/api";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'SINCRONIZACION_DOCUMENTOS': {
                "LISTAR_PREFIJOS": BASE_URL + "/SincronizacionDocumentos/listarPrefijos",
                "INSERTAR_TIPO_CUENTA": BASE_URL + "/SincronizacionDocumentos/insertTiposCuentas",
                "LISTAR_TIPO_CUENTA_CATEGORIA": BASE_URL + "/SincronizacionDocumentos/listarTipoCuentaCategoria",
                "LISTAR_DOCUMENTOS_CUENTAS": BASE_URL + "/SincronizacionDocumentos/listarDocumentosCuentas",
                "LISTAR_TIPOS_CUENTAS": BASE_URL + "/SincronizacionDocumentos/listarTiposCuentas",
                "LISTAR_TIPOS_SERVICIOS": BASE_URL + "/SincronizacionDocumentos/listarTiposServicios",
                "LISTAR_SERVICIOS": BASE_URL + "/SincronizacionDocumentos/listarServicios",
                "SINCRONIZACION_DOCUMENTOS": BASE_URL + "/SincronizacionDocumentos/sincronizarDocumentos",
                "LISTAR_TIPOS_FACTURAS": BASE_URL + "/SincronizacionDocumentos/listarTiposFacturas",
                "GUARDAR_CUENTAS": BASE_URL + "/SincronizacionDocumentos/guardarCuentas",
                "DELETE_ACCOUNTS": BASE_URL + "/SincronizacionDocumentos/deleteAccounts",
                "BUSCAR_SERVICIO": BASE_URL + "/SincronizacionDocumentos/buscarServicio"
            },
            'PROVEEDORES':{
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar'
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });
    return Url;
});
