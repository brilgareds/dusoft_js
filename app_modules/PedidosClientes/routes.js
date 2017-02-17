module.exports = function(app, di_container) {

    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    var e_pedidos_clientes = di_container.get("e_pedidos_clientes");

    var io = di_container.get("socket");

    

    // ================= POST =======================

    // Listar todos los pedidos de los Clientes
    app.post('/api/PedidosClientes/listarPedidos', function(req, res) {
        c_pedidos_clientes.listarPedidosClientes(req, res);
    });

    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosClientes/asignarResponsable', function(req, res) {
        c_pedidos_clientes.asignarResponsablesPedido(req, res);
    });

    // Asignar o seleccionar responsables del pedido
    app.post('/api/PedidosClientes/eliminarResponsablesPedido', function(req, res) {
        c_pedidos_clientes.eliminarResponsablesPedido(req, res);
    });

    // Seleccionar los pedidos de un operario de bodega
    app.post('/api/PedidosClientes/listaPedidosOperarioBodega', function(req, res) {
        c_pedidos_clientes.listaPedidosOperariosBodega(req, res);
    });

    /* Cotizaciones */

    // Listar Cotizaciones     
    app.post('/api/PedidosClientes/listarCotizaciones', function(req, res) {
        c_pedidos_clientes.listarCotizaciones(req, res);
    });

    // Consultar Cotizacion
    app.post('/api/PedidosClientes/consultarCotizacion', function(req, res) {
        c_pedidos_clientes.consultarCotizacion(req, res);
    });

    // Consultar Detalle Cotización
    app.post('/api/PedidosClientes/consultarDetalleCotizacion', function(req, res) {
        c_pedidos_clientes.consultarDetalleCotizacion(req, res);
    });

    //Listar Productos Clientes para ingresar productos a una cotizacion
    app.post('/api/PedidosClientes/listarProductosClientes', function(req, res) {
        c_pedidos_clientes.listarProductosClientes(req, res);
    });

    // Insertar Encabezado de Cotización
    app.post('/api/PedidosClientes/insertarCotizacion', function(req, res) {
        c_pedidos_clientes.insertarCotizacion(req, res);
    });

    // Insertar Detalle de Cotización
    app.post('/api/PedidosClientes/insertarDetalleCotizacion', function(req, res) {
        c_pedidos_clientes.insertarDetalleCotizacion(req, res);
    });

    // Modificar Detalle de Cotización
    app.post('/api/PedidosClientes/modificarDetalleCotizacion', function(req, res) {
        c_pedidos_clientes.modificarDetalleCotizacion(req, res);
    });

    // Eliminar producto de la Cotización
    app.post('/api/PedidosClientes/eliminarProductoCotizacion', function(req, res) {
        c_pedidos_clientes.eliminarProductoCotizacion(req, res);
    });

    // Observacion Cartera Cotizacion
    app.post('/api/PedidosClientes/observacionCarteraCotizacion', function(req, res) {
        c_pedidos_clientes.observacionCarteraCotizacion(req, res);
    });

    // Subir Archivo Plano
    app.post('/api/PedidosClientes/subirPlano', function(req, res) {
        c_pedidos_clientes.cotizacionArchivoPlano(req, res);
    });
    
    // Reporte Cotización    
    app.post('/api/PedidosClientes/reporteCotizacion', function(req, res) {
        c_pedidos_clientes.reporteCotizacion(req, res);
    });

    /* Generacion Pedidos */

    // Generar Pedido
    app.post('/api/PedidosClientes/generarPedido', function(req, res) {
        c_pedidos_clientes.generarPedido(req, res);
    });

    // Insertar Detalle Pedido
    app.post('/api/PedidosClientes/insertarDetallePedido', function(req, res) {
        c_pedidos_clientes.insertarDetallePedido(req, res);
    });

    // Modificar Detalle Pedido
    app.post('/api/PedidosClientes/modificarDetallePedido', function(req, res) {
        c_pedidos_clientes.modificarDetallePedido(req, res);
    });

    // Consultar Pedido
    app.post('/api/PedidosClientes/consultarPedido', function(req, res) {
        c_pedidos_clientes.consultarPedido(req, res);
    });

    // Consultar Detalle Pedido
    app.post('/api/PedidosClientes/consultarDetallePedido', function(req, res) {
        c_pedidos_clientes.consultarDetallePedido(req, res);
    });

    // Eliminar Producto Pedido
    app.post('/api/PedidosClientes/eliminarProductoPedido', function(req, res) {
        c_pedidos_clientes.eliminarProductoPedido(req, res);
    });

    // Observacion Cartera Pedido
    app.post('/api/PedidosClientes/observacionCarteraPedido', function(req, res) {
        c_pedidos_clientes.observacionCarteraPedido(req, res);
    });

    // Reporte Pedido    
    app.post('/api/PedidosClientes/reportePedido', function(req, res) {
        c_pedidos_clientes.reportePedido(req, res);
    });
    
    app.post('/api/PedidosClientes/modificarEstadoCotizacion', function(req, res) {
        c_pedidos_clientes.modificarEstadoCotizacion(req, res);
    });
    
    app.post('/api/PedidosClientes/consultarEstadoPedido', function(req, res) {
        c_pedidos_clientes.consultarEstadoPedido(req, res);
    });
    app.post('/api/PedidosClientes/consultarEstadoCotizacion', function(req, res) {
        c_pedidos_clientes.consultarEstadoCotizacion(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para actualizar el estado de una cotizacion 
     *               Aprobar con prioridad
     */
    app.post('/api/PedidosClientes/solicitarAutorizacion', function(req, res) {
        c_pedidos_clientes.solicitarAutorizacion(req, res);
    });
    
    
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para actualizar el estado de una cotizacion 
     *               Aprobar con prioridad
     */
    app.post('/api/PedidosClientes/actualizarCabeceraCotizacion', function(req, res) {
        c_pedidos_clientes.actualizarCabeceraCotizacion(req, res);
    });
    
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para eliminar la cotizacion
     */
    app.post('/api/PedidosClientes/eliminarCotizacion', function(req, res) {
        c_pedidos_clientes.eliminarCotizacion(req, res);
    });
    
    
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para validar el estado y el total de valor de pedido
     */
    app.post('/api/PedidosClientes/validarEstadoTotalValorPedido', function(req, res) {
        c_pedidos_clientes.validarEstadoTotalValorPedido(req, res);
    });
    
   /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para insertar la cantidad en un producto
     */
    app.post('/api/PedidosClientes/insertarCantidadProductoDetallePedido', function(req, res) {
        c_pedidos_clientes.insertarCantidadProductoDetallePedido(req, res);
    });
     
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para insertar la cantidad en un producto
     */
    app.post('/api/PedidosClientes/enviarNotificacionPedidosClientes', function(req, res) {
        c_pedidos_clientes.enviarNotificacionPedidosClientes(req, res);
    });
     
    /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para insertar la cantidad en un producto
     */
    app.post('/api/PedidosClientes/validarDisponibilidad', function(req, res) {
        c_pedidos_clientes.validarDisponibilidad(req, res);
    });
     
     /**
     * @author Cristian Ardila
     * +Descripcion: Servicio para consultar la factura fiscal de un pedido
     */
    app.post('/api/PedidosClientes/listarFacturasPedido', function(req, res) {
        c_pedidos_clientes.listarFacturasPedido(req, res);
    });
    
    /**
    * @author Cristian Ardila
    * +Descripcion: Servicio para generar un pedido sin que la cotizacion pase
    *               por los procesos de autorizacion de cartera, esto con el objetivo
    *               de que el servicio sea invocado desde el modulo de farmacias
    */
    app.post('/api/PedidosClientes/generarPedidoBodegaFarmacia', function(req, res) {
        c_pedidos_clientes.generarPedidoBodegaFarmacia(req, res);
    });
};