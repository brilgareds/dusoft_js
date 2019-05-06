define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    const BASE_URL = "/api";

    let data = {
        'API': {
            'BASE_URL': BASE_URL,
            'NOTAS_PROVEEDORES': {
                'TIPOS_DOC': BASE_URL + '/notasProveedores/tiposDoc',
                'LISTAR_NOTAS': BASE_URL + '/notasProveedores/listarNotasProveedores',
                'AGREGAR_DETALLE_TEMPORAL': BASE_URL + '/notasProveedores/agregarDetalleTemporal',
                'CONCEPTOS_ESPECIFICOS' : BASE_URL + '/notasProveedores/conceptosEspecificos',
                'ELIMINAR_PRODUCTO_TEMPORAL': BASE_URL + '/notasProveedores/eliminarProductoTemporal',
                'CREAR_NOTA': BASE_URL + '/notasProveedores/crearNota',
                'CREAR_NOTA_TEMPORAL': BASE_URL + '/notasProveedores/crearNotaTemporal',
                'VER_NOTAS_FACTURA': BASE_URL + '/notasProveedores/verNotasFactura',
                'IMPRIMIR_NOTA': BASE_URL + '/notasProveedores/imprimirNota',
                'LISTAR_RETENCIONES_ANUALES': BASE_URL + '/notasProveedores/listarRetencionesAnuales'
            }
        }
    };

    angular.forEach(data, (key, value) => {
        Url.constant(value, key);
    });

    return Url;
});
