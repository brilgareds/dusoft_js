define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDEX': {
                'LISTA_DOCUMENTOS_USUARIOS': BASE_URL + '/movBodegas/consultarDocumentosUsuario',
                'ELIMINAR_PRODUCTO_MOVIMIENTO_BODEGA_TEMPORAL': BASE_URL + '/movBodegas/eliminar_producto_movimiento_bodega_temporal',
                'ADD_ITEM_DOC_TEMPORAL': BASE_URL + '/movBodegas/addItemDocTemporal',
                'LISTAR_DOCUMENTOS_TEMPORALES': BASE_URL + '/movBodegas/obtenerDocumetosTemporales',
                'GET_TIPOS_DOCUMENTOS_BODEGA_USUARIO': BASE_URL + '/movBodegas/getTiposDocumentosBodegaUsuario',
                'GET_DOCUMENTOS_BODEGA_USUARIO': BASE_URL + '/movBodegas/getDocumentosBodegaUsuario',
            },
            'I002': {
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar',
                'LISTAR_ORDENES_COMPRAS_PROVEEDOR': BASE_URL + '/OrdenesCompra/listarOrdenesCompraProveedor',
                'CREAR_DETALLE_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/insertarDetalleOrdenCompra',
                'CONSULTAR_DETALLE_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/consultarDetalleOrdenCompra',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/I002/newDocTemporal',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I002/eliminarGetDocTemporal',
                'LISTAR_INV_BODEGAS_MOVIMIENTO_TEMPORAL_ORDEN': BASE_URL + '/movBodegas/I002/listarInvBodegasMovimientoTmpOrden',
                'LISTAR_PARAMETROS_RETENCION': BASE_URL + '/movBodegas/I002/listarParametrosRetencion',
                'LISTAR_GET_ITEMS_DOC_TEMPORAL': BASE_URL + '/movBodegas/I002/listarGetItemsDocTemporal',
                'LISTAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I002/listarGetDocTemporal',
                'LISTAR_PRODUCTOS_POR_AUTORIZAR': BASE_URL + '/movBodegas/I002/listarProductosPorAutorizar',
                'LISTAR_PRODUCTOS_PARA_ASIGNAR': BASE_URL + '/movBodegas/I002/listarProductosParaAsignar',
                'CREAR_ITEM_FOC': BASE_URL + '/movBodegas/I002/agregarItemFOC',
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/crearDocumento',
                'EXEC_CREAR_DOCUMENTOS': BASE_URL + '/movBodegas/I002/execCrearDocumento',
                'CREAR_HTML_DOCUMENTO': BASE_URL + '/movBodegas/I002/crearHtmlDocumento',
                                
            },
            'I003': {
            },
            'E007': {
            },
            'LABORATORIOS': {
                'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios'
            },
            'ORDENES_COMPRA': {
                'LISTAR_PRODUCTOS': BASE_URL + '/OrdenesCompra/listarProductos',
            }    
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
