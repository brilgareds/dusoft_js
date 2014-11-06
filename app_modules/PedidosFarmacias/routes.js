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
    
    // Cuenta el número de registros en el encabezado del pedido por empresa, centro de utilidad, bodega y usuario
    app.post('/api/PedidosFarmacias/countRegistrosEncabezadoTemporal', function(req, res) {
        c_pedidos_farmacias.countRegistrosEncabezadoTemporal(req, res);
    });
    
    // Cuenta el número de registros en el detalle del pedido por empresa, centro de utilidad, bodega, codigo de producto y usuario
    app.post('/api/PedidosFarmacias/countRegistrosDetalleTemporal', function(req, res) {
        c_pedidos_farmacias.countRegistrosDetalleTemporal(req, res);
    });    
    
    // Listar productos
//    app.get('/listarProductos', function(req, res) {
//        c_pedidos_farmacias.listar_productos(req, res);
//    });
    
    

    // ================= GET =======================

};