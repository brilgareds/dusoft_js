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
    
    // Crear Pre-orden o Pedido Temporal
    app.post('/api/PedidosFarmacias/crearPedidoTemporal', function(req, res) {
        c_pedidos_farmacias.crearPedidoTemporal(req, res);
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
    
    // Seleccionar los pedidos de un operario de bodega
    app.post('/api/PedidosFarmacias/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_farmacias.listaPedidosOperariosBodega(req, res);
    });
    
    // Listar productos
    app.post('/api/PedidosFarmacias/listarProductos', function(req, res) {
        c_pedidos_farmacias.listar_productos(req, res);
    });
    
    // Retorna 1 si el registro existe y 0 si no existe en el encabezado del pedido. Se filtra pedido por empresa, centro de utilidad, bodega y usuario
    app.post('/api/PedidosFarmacias/existeRegistroEncabezadoTemporal', function(req, res) {
        c_pedidos_farmacias.existeRegistroEncabezadoTemporal(req, res);
    });
    
    // Retorna 1 si el registro existe y 0 si no existe en el detalle del pedido. Se filtra por empresa, centro de utilidad, bodega, codigo de producto y usuario
    app.post('/api/PedidosFarmacias/existeRegistroDetalleTemporal', function(req, res) {
        c_pedidos_farmacias.existeRegistroDetalleTemporal(req, res);
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
    
    // Elimina el detalle completo del pedido por empresa, centro de utilidad, bodega y usuario
    app.post('/api/PedidosFarmacias/eliminarDetalleTemporalCompleto', function(req, res) {
        c_pedidos_farmacias.eliminarDetalleTemporalCompleto(req, res);
    }); 
    
    // Inserta el encabezado del pedido definitivo
    app.post('/api/PedidosFarmacias/insertarPedidoFarmaciaDefinitivo', function(req, res) {
        c_pedidos_farmacias.insertarPedidoFarmaciaDefinitivo(req, res);
    });
    
    // Inserta el detalle del pedido definitivo
    app.post('/api/PedidosFarmacias/insertarDetallePedidoFarmaciaDefinitivo', function(req, res) {
        c_pedidos_farmacias.insertarDetallePedidoFarmaciaDefinitivo(req, res);
    });    
    
    //Consultar Encabezado del Pedido
    app.post('/api/PedidosFarmacias/consultarEncabezadoPedidoFinal', function(req, res) {
        c_pedidos_farmacias.consultarEncabezadoPedidoFinal(req, res);
    });
    
    //Consultar Detalle del Pedido
    app.post('/api/PedidosFarmacias/consultarDetallePedidoFinal', function(req, res) {
        c_pedidos_farmacias.consultarDetallePedidoFinal(req, res);
    });  
    
    //Actualizar Cantidades Detalle Pedido Final
    app.post('/api/PedidosFarmacias/actualizarCantidadesDetallePedidoFinal', function(req, res) {
        c_pedidos_farmacias.actualizarCantidadesDetallePedidoFinal(req, res);
    });
    
    //Eliminar Producto Detalle Pedido Final
    app.post('/api/PedidosFarmacias/eliminarProductoDetallePedidoFinal', function(req, res) {
        c_pedidos_farmacias.eliminarProductoDetallePedidoFinal(req, res);
    });
    
    // Pedido Farmacia por archivo plano
    app.post('/api/PedidosFarmacias/pedidoFarmaciaArchivoPlano', function(req, res) {
        console.log(">>>>> Viendo la Ruta de Consulta");
        c_pedidos_farmacias.pedidoFarmaciaArchivoPlano(req, res);
    });    
    
    // Listar productos
//    app.get('/listarProductos', function(req, res) {
//        c_pedidos_farmacias.listar_productos(req, res);
//    });
    
    

    // ================= GET =======================

};