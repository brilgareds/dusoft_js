define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'INDEX': {
                'LISTA_DOCUMENTOS_USUARIOS': BASE_URL + '/movBodegas/consultarDocumentosUsuario',
            },
            'I002': {
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar',
                'LISTAR_ORDENES_COMPRAS_PROVEEDOR': BASE_URL + '/OrdenesCompra/listarOrdenesCompraProveedor',
                'CONSULTAR_DETALLE_ORDEN_COMPRA': BASE_URL + '/OrdenesCompra/consultarDetalleOrdenCompra',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/I002/newDocTemporal',
                'LISTAR_INV_BODEGAS_MOVIMIENTO_TEMPORAL_ORDEN': BASE_URL + '/movBodegas/I002/listarInvBodegasMovimientoTmpOrden',
                'LISTAR_PARAMETROS_RETENCION': BASE_URL + '/movBodegas/I002/listarParametrosRetencion',
                'LISTAR_GET_ITEMS_DOC_TEMPORAL': BASE_URL + '/movBodegas/I002/listarGetItemsDocTemporal',
                'LISTAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I002/listarGetDocTemporal',
                
            },
            'I003': {
            },
            'E007': {
            }
        }
    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
