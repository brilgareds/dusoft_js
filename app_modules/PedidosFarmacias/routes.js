module.exports = function(app, di_container) {

    var io = di_container.get("socket");
    var c_pedidos_farmacias = di_container.get("c_pedidos_farmacias");

    // ================= POST =======================

    // Listar Empresas a las que tiene acceso el usuario
    // NOTA: Este tipo de accesos es temporal ya que se implementara
    //       Un sistema de Roles y Permisos en el futuro. 2014    
    app.post('/api/PedidosFarmacias/obtenerEmpresas', function(req, res) {
        c_pedidos_farmacias.obtenerEmpresas(req, res);
    });
    
    // Listar las farmacias a las que tiene acceso el usuario
    app.post('/api/PedidosFarmacias/listarFarmacias', function(req, res) {
        c_pedidos_farmacias.listarFarmaciasUsuarios(req, res);
    });
    
    // Listar las Centros Utilidad a las que tiene acceso el usuario
    app.post('/api/PedidosFarmacias/listarCentrosUtilidad', function(req, res) {
        c_pedidos_farmacias.listarCentrosUtilidadUsuarios(req, res);
    });    
    
    // Listar las Boedgas a las que tiene acceso el usuario
    app.post('/api/PedidosFarmacias/listarBodegas', function(req, res) {
        c_pedidos_farmacias.listarBodegasUsuarios(req, res);
    });
    
    // depreciado Crear Pre-orden o Pedido Temporal
    app.post('/api/PedidosFarmacias/crearPedidoTemporal', function(req, res) {
        c_pedidos_farmacias.crearPedidoTemporal(req, res);
    });
    
    app.post('/api/PedidosFarmacias/guardarPedidoTemporal', function(req, res) {
        c_pedidos_farmacias.guardarPedidoTemporal(req, res);
    });
    
    // Insertar productos en Pre-orden o Pedido Temporal
    app.post('/api/PedidosFarmacias/ingresarDetallePedidoTemporal', function(req, res) {
        c_pedidos_farmacias.ingresarDetallePedidoTemporal(req, res);
    });  

    // Listar Todos los pedidos de farmacia
    app.post('/api/PedidosFarmacias/listarPedidos', function(req, res) {
        c_pedidos_farmacias.listarPedidosFarmacias(req, res);
    });

    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosFarmacias/asignarResponsable', function(req, res) {
        c_pedidos_farmacias.asignarResponsablesPedido(req, res);
    });
    
    app.post('/api/PedidosClientes/asignarResponsablesPedidoAutomatico', function(req, callback) {
        c_pedidos_farmacias.asignarResponsablesPedidoAutomatico(req, function(respuesta){
            callback(respuesta);
        });
    }); 
    
    // Eliminar responsables del pedido
    app.post('/api/PedidosFarmacias/eliminarResponsablesPedido', function(req, res) {
        c_pedidos_farmacias.eliminarResponsablesPedido(req, res);
    });
    
    // Seleccionar los pedidos de un operario de bodega
    app.post('/api/PedidosFarmacias/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_farmacias.listaPedidosOperariosBodega(req, res);
    });
    
    app.post('/api/PedidosFarmacias/obtenerDetallePedido', function(req, res) {
        c_pedidos_farmacias.obtenerDetallePedido(req, res);
    });
    
    app.post('/api/PedidosFarmacias/buscarProductos', function(req, res) {
        c_pedidos_farmacias.buscarProductos(req, res);
    });
    
    app.post('/api/PedidosFarmacias/generarPedidoFarmacia', function(req, res) {
        c_pedidos_farmacias.generarPedidoFarmacia(req, res);
    });
    
    app.post('/api/PedidosFarmacias/eliminarPedidoTemporal', function(req, res) {
        c_pedidos_farmacias.eliminarPedidoTemporal(req, res);
    }); 
    
    app.post('/api/PedidosFarmacias/subirArchivoPlano', function(req, res) {
        c_pedidos_farmacias.subirArchivoPlano(req, res);
    }); 
    
    app.post('/api/PedidosFarmacias/enviarEmailPedido', function(req, res) {
        c_pedidos_farmacias.enviarEmailPedido(req, res);
    }); 

    // Consulta Encabezado de Pedido Temporal
    app.post('/api/PedidosFarmacias/consultarPedidoFarmaciaTemporal', function(req, res) {
        c_pedidos_farmacias.consultarPedidoFarmaciaTemporal(req, res);
    });
    
    // Trae listado de productos de pedido temporal
    app.post('/api/PedidosFarmacias/listarProductosDetalleTemporal', function(req, res) {
        c_pedidos_farmacias.listarProductosDetalleTemporal(req, res);
    });

    // Elimina el registro del encabezado del pedido por empresa, centro de utilidad, bodega y usuario
    app.post('/api/PedidosFarmacias/eliminarRegistroEncabezadoTemporal', function(req, res) {
        c_pedidos_farmacias.eliminarRegistroEncabezadoTemporal(req, res);
    });
    
    // Elimina el registro del detalle del pedido por empresa, centro de utilidad, bodega, codigo de producto y usuario
    app.post('/api/PedidosFarmacias/eliminarRegistroDetalleTemporal', function(req, res) {
        c_pedidos_farmacias.eliminarRegistroDetalleTemporal(req, res);
    }); 
    
    //Inserta el detalle del pedido definitivo
    app.post('/api/PedidosFarmacias/insertarDetallePedidoFarmacia', function(req, res) {
        c_pedidos_farmacias.insertarDetallePedidoFarmacia(req, res);
    });    
    
    //Consultar Encabezado del Pedido
    app.post('/api/PedidosFarmacias/consultarEncabezadoPedido', function(req, res) {
        c_pedidos_farmacias.consultarEncabezadoPedido(req, res);
    });
    
    //Consultar Detalle del Pedido
    app.post('/api/PedidosFarmacias/consultarDetallePedido', function(req, res) {
        c_pedidos_farmacias.consultarDetallePedido(req, res);
    });  
    
    //Actualizar Cantidades Detalle Pedido Final
    app.post('/api/PedidosFarmacias/actualizarCantidadesDetallePedido', function(req, res) {
        c_pedidos_farmacias.actualizarCantidadesDetallePedido(req, res);
    });
    
    //Eliminar Producto Detalle Pedido Final
    app.post('/api/PedidosFarmacias/eliminarProductoDetallePedido', function(req, res) {
        c_pedidos_farmacias.eliminarProductoDetallePedido(req, res);
    });
    
    // Pedido Farmacia por archivo plano
    app.post('/api/PedidosFarmacias/pedidoFarmaciaArchivoPlano', function(req, res) {
        c_pedidos_farmacias.pedidoFarmaciaArchivoPlano(req, res);
    });    
    
    app.post('/api/PedidosFarmacias/generarPdfPedido', function(req, res) {
        c_pedidos_farmacias.generarPdfPedido(req, res);
    }); 
    
    //Actualizar Estado Pedido
    app.post('/api/PedidosFarmacias/actualizarEstadoActualPedido', function(req, res) {
        c_pedidos_farmacias.actualizarEstadoActualPedido(req, res);
    });
    
    //Listar Pedidos Temporales Farmacia
    app.post('/api/PedidosFarmacias/listarPedidosTemporalesFarmacias', function(req, res) {
        c_pedidos_farmacias.listarPedidosTemporalesFarmacias(req, res);
    });
    
    //Buscar Usuario Bloqueo
    app.post('/api/PedidosFarmacias/buscarUsuarioBloqueo', function(req, res) {
        c_pedidos_farmacias.buscarUsuarioBloqueo(req, res);
    });
    
    //consultarProductoEnFarmacia
    app.post('/api/PedidosFarmacias/consultarProductoEnFarmacia', function(req, res) {
        c_pedidos_farmacias.consultarProductoEnFarmacia(req, res);
    });
    
    //actualizarEncabezadoPedidoDefinitivo
    app.post('/api/PedidosFarmacias/actualizarPedido', function(req, res) {
        c_pedidos_farmacias.actualizarPedido(req, res);
    });
    
    //existeRegistroDetallePedido
    app.post('/api/PedidosFarmacias/existeRegistroDetallePedido', function(req, res) {
        c_pedidos_farmacias.existeRegistroDetallePedido(req, res);
    });
    
    //insertarProductoDetallePedidoFarmacia
    app.post('/api/PedidosFarmacias/insertarProductoDetallePedidoFarmacia', function(req, res) {
        c_pedidos_farmacias.insertarProductoDetallePedidoFarmacia(req, res);
    });
    
    app.post('/api/PedidosFarmacias/anularPendienteProducto', function(req, res) {
        c_pedidos_farmacias.anularPendienteProducto(req, res);
    });
    
    app.post('/api/PedidosFarmacias/generarPedidoModuloCliente', function(req, res) {
        c_pedidos_farmacias.generarPedidoModuloCliente(req, res);
    });
    
    app.post('/api/PedidosFarmacias/actualizarEstadoPedidoFarmacia', function(req, res) {
        c_pedidos_farmacias.actualizarEstadoPedidoFarmacia(req, res);
    });
    
    app.post('/api/PedidosFarmacias/actualizarCantidadPendientePedidoFarmacia', function(req, res) {
        c_pedidos_farmacias.actualizarCantidadPendientePedidoFarmacia(req, res);
    });

    // ================= GET =======================

};