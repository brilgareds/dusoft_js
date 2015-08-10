module.exports = function(app, di_container) {

    var c_pedidos_clientes = di_container.get("c_pedidos_clientes");
    var e_pedidos_clientes = di_container.get("e_pedidos_clientes");



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

    // Eliminar producto de la Cotización
    app.post('/api/PedidosClientes/eliminarProductoCotizacion', function(req, res) {
        c_pedidos_clientes.eliminarProductoCotizacion(req, res);
    });
    
    // Observacion Cartera
    app.post('/api/PedidosClientes/observacionCartera', function(req, res) {
        c_pedidos_clientes.observacionCartera(req, res);
    });

    // Subir Archivo Plano
    app.post('/api/PedidosClientes/subirPlano', function(req, res) {
        c_pedidos_clientes.cotizacionArchivoPlano(req, res);
    });
    
    
    
    
    
    
    

    /**************************************************
     * 
     *  REVISAR DESDE ACA HACIA ABAJO 
     *
     /**************************************************/

    // Obtiene la informacion especifica del pedido seleccionado, busca por numero de pedido.
    //??????????????????????????????????????????????????
    app.post('/api/PedidosClientes/obtenerPedido', function(req, res) {
        c_pedidos_clientes.obtenerPedido(req, res);
    });

    //?????????????????????????????????????????????????
    app.post('/api/PedidosClientes/obtenerDetallePedido', function(req, res) {
        c_pedidos_clientes.obtenerDetallePedido(req, res);
    });






    // Consultar Estado de Cotización
    //??????????????????????????????????????????????????    
    app.post('/api/PedidosClientes/estadoCotizacion', function(req, res) {
        c_pedidos_clientes.estadoCotizacion(req, res);
    });


    // Consultar Estado de Pedido
    // ??????????????????????????????????????
    app.post('/api/PedidosClientes/estadoPedido', function(req, res) {
        c_pedidos_clientes.estadoPedido(req, res);
    });


    // Cambiar Estado Cotización
    //??????????????????????
    app.post('/api/PedidosClientes/cambiarEstadoCotizacion', function(req, res) {
        c_pedidos_clientes.cambiarEstadoCotizacion(req, res);
    });




    // Generar PDF Cotización
    //????????????????????????
    app.post('/api/PedidosClientes/imprimirCotizacionCliente', function(req, res) {
        c_pedidos_clientes.imprimirCotizacionCliente(req, res);
    });

    //Generar PDF Pedido
    //???????????????????????????????
    app.post('/api/PedidosClientes/imprimirPedidoCliente', function(req, res) {
        c_pedidos_clientes.imprimirPedidoCliente(req, res);
    });

    // Listado Pedidos Clientes
    //??????????????????????
    app.post('/api/PedidosClientes/listadoPedidosClientes', function(req, res) {
        c_pedidos_clientes.listadoPedidosClientes(req, res);
    });

    // Insertar Pedidos Clientes
    // ??????????????????????????????
    app.post('/api/PedidosClientes/insertarPedidoCliente', function(req, res) {
        c_pedidos_clientes.insertarPedidoCliente(req, res);
    });

    //Listar Detalle Pedido
    //?????????????????????????
    app.post('/api/PedidosClientes/listarDetallePedido', function(req, res) {
        c_pedidos_clientes.listarDetallePedido(req, res);
    });

    //Insertar Detalle Pedido Cliente. Usado solo para modificación de pedido ya creado por Cotización.
    //????????????????????????????????
    app.post('/api/PedidosClientes/insertarDetallePedido', function(req, res) {
        c_pedidos_clientes.insertarDetallePedido(req, res);
    });

    //Eliminar Registro del Detalle Pedido Cliente. Usado solo para modificación de pedido ya creado por Cotización.
    //????????????????????????
    app.post('/api/PedidosClientes/eliminarRegistroDetallePedido', function(req, res) {
        c_pedidos_clientes.eliminarRegistroDetallePedido(req, res);
    });

    //Modificar Detalle de Cotización
    //????????????????????????????
    app.post('/api/PedidosClientes/modificarCantidadesCotizacion', function(req, res) {
        c_pedidos_clientes.modificarCantidadesCotizacion(req, res);
    });

    //Modificar Detalle de Pedido
    //????????????????????????
    app.post('/api/PedidosClientes/modificarCantidadesPedido', function(req, res) {
        c_pedidos_clientes.modificarCantidadesPedido(req, res);
    });

    //Cambiar el Estado de Aprobacion de la Cotizacion
    //????????????????????????????????
    app.post('/api/PedidosClientes/cambiarEstadoAprobacionCotizacion', function(req, res) {
        c_pedidos_clientes.cambiarEstadoAprobacionCotizacion(req, res);
    });

    //cambiarEstadoAprobacionPedido
    //?????????????????????????????
    app.post('/api/PedidosClientes/cambiarEstadoAprobacionPedido', function(req, res) {
        c_pedidos_clientes.cambiarEstadoAprobacionPedido(req, res);
    });




    //consultarEncabezadoPedido
    //??????????????????????
    app.post('/api/PedidosClientes/consultarEncabezadoPedido', function(req, res) {
        c_pedidos_clientes.consultarEncabezadoPedido(req, res);
    });

};