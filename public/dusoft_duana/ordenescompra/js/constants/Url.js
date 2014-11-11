define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'ORDENES_COMPRA': {
                'LISTAR_ORDENES_COMPRAS': BASE_URL + '/OrdenesCompra/listarOrdenesCompra',
                'LISTAR_PRODUCTOS': BASE_URL + '/OrdenesCompra/listarProductos',
                'CREAR_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/insertarOrdenCompra',
                'CREAR_DETALLE_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/insertarDetalleOrdenCompra',
                'CONSULTAR_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/consultarOrdenCompra',
                'CONSULTAR_DETALLE_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/consultarDetalleOrdenCompra',
                'MODIFICAR_UNIDAD_NEGOCIO': BASE_URL + '/OrdenesCompra/modificarUnidadNegocio',
                'MODIFICAR_OBSERVACION': BASE_URL + '/OrdenesCompra/modificarObservacion',
                'ELIMINAR_PRODUCTO_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/eliminarProductoOrdenCompra',
                'ANULAR_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/anularOrdenCompra',
            },
            'PROVEEDORES': {
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar'
            },
            'UNIDADES_NEGOCIO': {
                'LISTAR_UNIDADES_NEGOCIO': BASE_URL + '/UnidadesNegocio/listarUnidadesNegocio'
            },
            'LABORATORIOS': {
                'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios'
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
