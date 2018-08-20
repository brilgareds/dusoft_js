define(["angular"], function (angular) {
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
                'GET_TIPOS_DOCUMENTOS_BODEGA_EMPRESA': BASE_URL + '/movBodegas/getTiposDocumentosBodegaEmpresa',
                'GET_DOCUMENTOS_BODEGA_USUARIO': BASE_URL + '/movBodegas/getDocumentosBodegaUsuario',
            },
            'I002': {
                'LISTAR_PROVEEDORES': BASE_URL + '/Terceros/Proveedores/listar',
                'LISTAR_PROVEEDORES_POR_CODIGO': BASE_URL + '/Terceros/Proveedores/listarProveedoresPorCodigo',
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
                'CREAR_HTML_AUTORIZACION': BASE_URL + '/movBodegas/I002/crearHtmlAutorizacion'

            },
            'I003': {
            },
            'I007': {
                'LISTAR_TIPOS_TERCEROS': BASE_URL + "/movBodegas/I007/listarTiposTerceros",
                'LISTAR_TERCEROS': BASE_URL + "/movBodegas/I007/listarTerceros",
                'LISTAR_PRESTAMOS': BASE_URL + "/movBodegas/I007/listarPrestamos",
                'LISTAR_PRODUCTOS': BASE_URL + '/movBodegas/I007/listarProductos',
                'CONSULTAR_PRODUCTOS_TRASLADO': BASE_URL + "/movBodegas/I007/listarProductosTraslado",
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/I007/newDocTemporal',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I007/eliminarGetDocTemporal',
                'AGREGAR_ITEM': BASE_URL + '/movBodegas/I007/agregarItem',
                'ELIMINAR_PRODUCTO_TRASLADO': BASE_URL + '/movBodegas/I007/eliminarItem',
                'LISTAR_TERCERO_ID': BASE_URL + "/movBodegas/I007/listarTerceroId",
                'LISTAR_PRESTAMO_ID': BASE_URL + "/movBodegas/I007/listarPrestamoId",
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/I007/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/I007/crearHtmlDocumento'

            },
            'I011': {
                'LISTAR_BODEGAS': BASE_URL + '/movBodegas/I011/listarBodegas',
                'LISTAR_BODEGA_ID': BASE_URL + '/movBodegas/I011/listarBodegaId',
                'CONSULTAR_DETALLE_DEVOLUCION': BASE_URL + '/movBodegas/I011/consultarDetalleDevolucion',
                'CONSULTAR_PRODUCTOS_VALIDADOS': BASE_URL + '/movBodegas/I011/consultarProductosValidados',
                'LISTAR_DEVOLUCIONES': BASE_URL + '/movBodegas/I011/listarDevoluciones',
                'CREAR_ITEM': BASE_URL + '/movBodegas/I011/agregarItem',
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/I011/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/I011/crearHtmlDocumento',
                'INSERTAR_CANTIDAD': BASE_URL + '/movBodegas/I011/modificarCantidad',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/I011/newDocTemporal',
                'ELIMINAR_PRODUCTO_DEVOLUCION': BASE_URL + '/movBodegas/I011/eliminarItem',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I011/eliminarGetDocTemporal',
                'LISTAR_NOVEDADES': BASE_URL + '/movBodegas/I011/listarNovedades',
                'LISTAR_TORRES': BASE_URL + '/movBodegas/I011/listarTorres',
                'CREAR_DOCUMENTO_TORRE': BASE_URL + '/movBodegas/I011/crearTorreDocumento'
            },
            'I012': {
                'LISTAR_TIPOS_TERCEROS': BASE_URL + "/movBodegas/I012/listarTiposTerceros",
                'LISTAR_CLIENTES': BASE_URL + "/movBodegas/I012/listarClientes",
                'LISTAR_CLIENTE_ID': BASE_URL + "/movBodegas/I012/listarClienteId",
                'LISTAR_FACTURAS': BASE_URL + "/movBodegas/I012/listarFacturas",
                'LISTAR_FACTURA_ID': BASE_URL + "/movBodegas/I012/listarFacturaId",
                'CONSULTAR_DETALLE_FACTURA': BASE_URL + "/movBodegas/I012/listarProductosFacturas",
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + "/movBodegas/I012/newDocTemporal",
                'AGREGAR_ITEM': BASE_URL + '/movBodegas/I012/agregarItem',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I012/eliminarGetDocTemporal',
                'CONSULTAR_PRODUCTOS_DEVUELTOS': BASE_URL + '/movBodegas/I012/consultarProductosDevueltos',
                'CONSULTAR_TIPO_FACTURA': BASE_URL + '/movBodegas/I012/tipoFactura',
                'ELIMINAR_PRODUCTO_DEVOLUCION': BASE_URL + '/movBodegas/I012/eliminarItem',
                'CONSULTAR_RETENCIONES': BASE_URL + '/movBodegas/I012/consultarRetenciones',
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/I012/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/I012/crearHtmlDocumento'
            },
            'I015': {
                'LISTAR_BODEGAS': BASE_URL + '/movBodegas/I015/listarBodegas',
                'LISTAR_DOCUMENTOS': BASE_URL + '/movBodegas/I015/listarTraslados',
                'LISTAR_PRODUCTOS_TRASLADO': BASE_URL + '/movBodegas/I015/listarProductosTraslados',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/I015/newDocTemporal',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/I015/eliminarGetDocTemporal',
                'AGREGAR_ITEM': BASE_URL + '/movBodegas/I015/agregarItem',
                'CONSULTAR_PRODUCTOS_VALIDADOS': BASE_URL + '/movBodegas/I015/listarProductosValidados',
                'ELIMINAR_PRODUCTO': BASE_URL + '/movBodegas/I015/eliminarItem',
                'LISTAR_DOCUMENTO_SELECCIONADO': BASE_URL + '/movBodegas/I015/listarDocumentoId',
                'LISTAR_FARMACIA_SELECCIONADA': BASE_URL + '/movBodegas/I015/listarFarmaciaId',
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/I015/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/I015/crearHtmlDocumento'
            },
            'E007': {
                'LISTAR_EGRESO': BASE_URL + '/movBodegas/E007/listarEgresos',
                'LISTAR_TIPOS_TERCEROS': BASE_URL + "/movBodegas/E007/listarTiposTerceros",
                'LISTAR_CLIENTES': BASE_URL + "/movBodegas/E007/listarClientes",
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/E007/newDocTemporal',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/E007/eliminarGetDocTemporal',
                'LISTAR_PRODUCTOS': BASE_URL + '/movBodegas/E007/listarProductos',
                'AGREGAR_ITEM': BASE_URL + '/movBodegas/E007/agregarItem',
                'CONSULTAR_LOTES_PRODUCTO': BASE_URL + '/movBodegas/E007/consultarLotesProducto',
                'CONSULTAR_PRODUCTOS_TRASLADO': BASE_URL + "/movBodegas/E007/listarProductosTraslado",
                'ELIMINAR_PRODUCTO_TRASLADO': BASE_URL + '/movBodegas/E007/eliminarItem',
                'LISTAR_CLIENTE_ID': BASE_URL + "/movBodegas/E007/listarClienteId",
                'LISTAR_EGRESO_ID': BASE_URL + "/movBodegas/E007/listarEgresoId",
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/E007/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/E007/crearHtmlDocumento'

            },
            'E009': {
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/E009/crearDocumento',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/E009/crearDocumentoImprimir',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/E009/newDocTemporal',
                'CREAR_ITEM': BASE_URL + '/movBodegas/E009/agregarItem',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/E009/eliminarGetDocTemporal',
                'LISTAR_BODEGAS': BASE_URL + '/movBodegas/E009/listarBodegas',
                'LISTAR_BODEGA_ID': BASE_URL + '/movBodegas/E009/listarBodegaId',
                'LISTAR_PRODUCTOS': BASE_URL + '/movBodegas/E009/listarProductos',
                'CONSULTAR_DETALLE_DEVOLUCION': BASE_URL + '/movBodegas/E009/consultarDetalleDevolucion',
                'ELIMINAR_PRODUCTO_DEVOLUCION': BASE_URL + '/movBodegas/E009/eliminarItem'
            },
            'E017': {
                'LISTAR_BODEGAS': BASE_URL + '/movBodegas/E017/listarBodegas',
                'LISTAR_BODEGAS_SELECCIONADA': BASE_URL + '/movBodegas/E017/listarBodegaId',
                'CREAR_NEW_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/E017/newDocTemporal',
                'CREAR_DOCUMENTO': BASE_URL + '/movBodegas/E017/crearDocumento',
                'ELIMINAR_GET_DOC_TEMPORAL': BASE_URL + '/movBodegas/E017/eliminarGetDocTemporal',
                'LISTAR_PRODUCTOS': BASE_URL + '/movBodegas/E017/listarProductos',
                'AGREGAR_ITEM': BASE_URL + '/movBodegas/E017/agregarItem',
                'CONSULTAR_PRODUCTOS_TRASLADO': BASE_URL + '/movBodegas/E017/consultarProductosTraslados',
                'ELIMINAR_PRODUCTO': BASE_URL + '/movBodegas/E017/eliminarItem',
                'CREAR_DOCUMENTO_IMPRIMIR': BASE_URL + '/movBodegas/E017/crearHtmlDocumento'
            },
            'LABORATORIOS': {
                'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios'
            },
            'ORDENES_COMPRA': {
                'LISTAR_PRODUCTOS': BASE_URL + '/OrdenesCompra/listarProductos',
            },
            'FACTURACIONPROVEEDOR': {
                'INSERTAR_FACTURA': BASE_URL + "/FacturacionProveedores/ingresarFactura"
            }
        }
    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
