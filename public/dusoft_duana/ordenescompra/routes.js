module.exports = function(app, di_container) {


    var c_ordenes_compra = di_container.get('c_ordenes_compra');

    // Listar Ordenes de Compras
    app.post('/api/OrdenesCompra/listarOrdenesCompra', function(req, res) {
        c_ordenes_compra.listarOrdenesCompra(req, res);
    });
    
    // Listar Ordenes de Compras Proveedor
    app.post('/api/OrdenesCompra/listarOrdenesCompraProveedor', function(req, res) {
        c_ordenes_compra.listarOrdenesCompraProveedor(req, res);
    });

    // Listar Productos para Ordenes de Compras
    app.post('/api/OrdenesCompra/listarProductos', function(req, res) {
        c_ordenes_compra.listarProductos(req, res);
    });

    // Ingresar Ordenes de Compras
    app.post('/api/OrdenesCompra/insertarOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarOrdenCompra(req, res);
    });

    // Modificar la unidad de negocio de una orden de compra 
    app.post('/api/OrdenesCompra/modificarUnidadNegocio', function(req, res) {
        c_ordenes_compra.modificarUnidadNegocio(req, res);
    });

    // Modificar Observacion de una orden de compra 
    app.post('/api/OrdenesCompra/modificarObservacion', function(req, res) {
        c_ordenes_compra.modificarObservacion(req, res);
    });

    // Insertar Detalle Ordene de Compras
    app.post('/api/OrdenesCompra/insertarDetalleOrdenCompra', function(req, res) {
        c_ordenes_compra.insertarDetalleOrdenCompra(req, res);
    });

    // Eliminar Orden de Compras
    app.post('/api/OrdenesCompra/cambiarEstado', function(req, res) {
        c_ordenes_compra.cambiarEstado(req, res);
    });

    // Eliminar Producto de una Orden de Compra
    app.post('/api/OrdenesCompra/eliminarProductoOrdenCompra', function(req, res) {
        c_ordenes_compra.eliminarProductoOrdenCompra(req, res);
    });

    // Consultar Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarOrdenCompra', function(req, res) {
        c_ordenes_compra.consultarOrdenCompra(req, res);
    });

    // Consultar Detalle Orden de Compra por numero de orden
    app.post('/api/OrdenesCompra/consultarDetalleOrdenCompra', function(req, res) {
        c_ordenes_compra.consultarDetalleOrdenCompra(req, res);
    });
    
    app.post('/api/OrdenesCompra/consultarDetalleOrdenCompraConNovedades', function(req, res) {
        c_ordenes_compra.consultarDetalleOrdenCompraConNovedades(req, res);
    });

    // Generar Orden de Compra
    app.post('/api/OrdenesCompra/finalizarOrdenCompra', function(req, res) {
        c_ordenes_compra.finalizarOrdenCompra(req, res);
    });

    // Orden de Compra a traves de un archivo plano
    app.post('/api/OrdenesCompra/subirPlano', function(req, res) {
        c_ordenes_compra.ordenCompraArchivoPlano(req, res);
    });

    // Generar Novedades Orden de Compra
    app.post('/api/OrdenesCompra/gestionarNovedades', function(req, res) {
        c_ordenes_compra.gestionarNovedades(req, res);
    });


    // Consultar Archivos Novedad Orden de Compra
    app.post('/api/OrdenesCompra/consultarArchivosNovedades', function(req, res) {
        c_ordenes_compra.consultarArchivosNovedades(req, res);
    });

    // Subir Archivos Novedades Orden de Compra
    app.post('/api/OrdenesCompra/subirArchivoNovedades', function(req, res) {
        c_ordenes_compra.subirArchivoNovedades(req, res);
    });
    
    app.post('/api/OrdenesCompra/eliminarNovedad', function(req, res) {
        c_ordenes_compra.eliminarNovedad(req, res);
    });

    // Generar Reporte Orden Compra
    app.post('/api/OrdenesCompra/reporteOrdenCompra', function(req, res) {
        c_ordenes_compra.reporteOrdenCompra(req, res);
    });    
    
    
    /* =========== Routes para Recepcion de Mercancia ==================*/
    
    // Listar recepciones mercancia
    app.post('/api/OrdenesCompra/listarRecepcionesMercancia', function(req, res) {
        c_ordenes_compra.listarRecepcionesMercancia(req, res);
    });
    
    // consultar recepcion mercancia
    app.post('/api/OrdenesCompra/consultarRecepcionMercancia', function(req, res) {
        c_ordenes_compra.consultarRecepcionMercancia(req, res);
    });
    
    // insertar recepcion mercancia
    app.post('/api/OrdenesCompra/insertarRecepcionMercancia', function(req, res) {
        c_ordenes_compra.insertarRecepcionMercancia(req, res);
    });
    
    // modificar recepcion mercancia
    app.post('/api/OrdenesCompra/modificarRecepcionMercancia', function(req, res) {
        c_ordenes_compra.modificarRecepcionMercancia(req, res);
    });
    
    // Listar productos recepcion mercancia
    app.post('/api/OrdenesCompra/listarProductosRecepcionMercancia', function(req, res) {
        c_ordenes_compra.listarProductosRecepcionMercancia(req, res);
    });
    
    // insertar productos recepcion mercancia
    app.post('/api/OrdenesCompra/insertarProductosRecepcionMercancia', function(req, res) {
        c_ordenes_compra.insertarProductosRecepcionMercancia(req, res);
    });
    
    // modificar productos recepcion mercancia
    app.post('/api/OrdenesCompra/modificarProductosRecepcionMercancia', function(req, res) {
        c_ordenes_compra.modificarProductosRecepcionMercancia(req, res);
    });
    
    // Finalizar recepcion mercancia
    app.post('/api/OrdenesCompra/finalizarRecepcionMercancia', function(req, res) {
        c_ordenes_compra.finalizarRecepcionMercancia(req, res);
    });
    
    // Listar Autorizaciones Compras
    app.post('/api/OrdenesCompra/listarAutorizacionCompras', function(req, res) {
        c_ordenes_compra.listarAutorizacionCompras(req, res);
    });

    // modificar Autorizaciones Compras
    app.post('/api/OrdenesCompra/modificarAutorizacionCompras', function(req, res) {
        c_ordenes_compra.modificarAutorizacionCompras(req, res);
    });

    // Insertar tmp movimiento bodega
    app.post('/api/OrdenesCompra/ingresarBodegaMovimientoTmpOrden', function(req, res) {
        c_ordenes_compra.ingresarBodegaMovimientoTmpOrden(req, res);
    });
    
    // Insertar tmp movimiento bodega productos
    app.post('/api/OrdenesCompra/ingresarBodegaMovimientoTmpProducto', function(req, res) {
        c_ordenes_compra.ingresarBodegaMovimientoTmpProducto(req, res);
    });
    
    app.post('/api/OrdenesCompra/guardarBodega', function(req, res) {
        c_ordenes_compra.guardarBodega(req, res);
    });

    app.post('/api/OrdenesCompra/subirArchivoOrdenes', function(req, res) {
        c_ordenes_compra.subirArchivoOrdenes(req, res);
    });
    
    app.post('/api/OrdenesCompra/obtenerArchivosNovedades', function(req, res) {
        c_ordenes_compra.obtenerArchivosNovedades(req, res);
    });
    
    
    /**
     * +Descripcion Generar orden de compra desde auditoria
     */
    app.post('/api/OrdenesCompra/generarOrdenDeCompraAuditado', function(req, res) {
        c_ordenes_compra.generarOrdenDeCompraAuditado(req, res);
    });
    G.eventEmitter.on("onGenerarOrdenDeCompra",function(parametros){
        c_ordenes_compra.generarOrdenDeCompraAuditado(parametros)
    });
    
};