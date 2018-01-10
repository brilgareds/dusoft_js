
var Kardex = function(kardex, pedidos_farmacias, pedidos_clientes, ordenes_compra, m_productos) {

 

    this.m_kardex = kardex;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_ordenes_compra = ordenes_compra;
    this.m_productos = m_productos;
};


Kardex.prototype.listar_productos = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.kardex === undefined || args.kardex.termino_busqueda === undefined || args.kardex.pagina_actual === undefined || args.kardex.empresa_id === undefined || args.kardex.centro_utilidad === undefined || args.kardex.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.kardex.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.kardex.empresa_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }

    if (args.kardex.centro_utilidad === '') {
        res.send(G.utils.r(req.url, 'Se requiere centro de ', 404, {}));
        return;
    }

    if (args.kardex.bodega_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere la bodega', 404, {}));
        return;
    }

    var termino_busqueda = args.kardex.termino_busqueda;
    var pagina_actual = args.kardex.pagina_actual;
    var empresa_id = args.kardex.empresa_id;
    var centro_utilidad = args.kardex.centro_utilidad;
    var bodega_id = args.kardex.bodega_id;


    this.m_productos.buscar_productos(empresa_id, centro_utilidad, bodega_id, termino_busqueda, pagina_actual, "0", function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};

Kardex.prototype.obtener_movimientos_producto = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.kardex === undefined || args.kardex.fecha_inicial === undefined || args.kardex.fecha_final === undefined || args.kardex.codigo_producto === undefined || args.kardex.empresa_id === undefined || args.kardex.centro_utilidad === undefined || args.kardex.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.kardex.codigo_producto === "" || args.kardex.fecha_inicial === "" || args.kardex.fecha_final === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }


    if (args.kardex.empresa_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {}));
        return;
    }

    if (args.kardex.centro_utilidad === '') {
        res.send(G.utils.r(req.url, 'Se requiere centro de ', 404, {}));
        return;
    }

    if (args.kardex.bodega_id === '') {
        res.send(G.utils.r(req.url, 'Se requiere la bodega', 404, {}));
        return;
    }


    var empresa_id = args.kardex.empresa_id;
    var centro_utilidad_id = args.kardex.centro_utilidad;
    var bodega_id = args.kardex.bodega_id;
    var codigo_producto = args.kardex.codigo_producto;
    var fecha_inicial = args.kardex.fecha_inicial;
    var fecha_final = args.kardex.fecha_final;

    // Seleccionar los Movimientos del Producto
   // G.redis.get("producto_"+codigo_producto,function(err, result){
       //if(!result){
        that.m_kardex.obtener_movimientos_productos(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, function(err, movimientos_producto) {

            var i = movimientos_producto.length;

            if (err)
                res.send(G.utils.r(req.url, 'Error Seleccionado los Movimientos del Producto', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
            else {
                // Seleccionar los Pedidos de Farmacia que estan Pendientes con ese producto
                that.m_pedidos_farmacias.listar_pedidos_pendientes_by_producto(empresa_id, codigo_producto, function(err, pendientes_farmacias) {

                    if (err)
                        res.send(G.utils.r(req.url, 'Error Seleccionado los Pendientes en Farmacias', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
                    else {
                        // Seleccionar los Pedidos de Clientes que estan Pendientes con ese producto
                        that.m_pedidos_clientes.listar_pedidos_pendientes_by_producto(empresa_id, codigo_producto, function(err, pendientes_clientes) {

                            if (err)
                                res.send(G.utils.r(req.url, 'Error Seleccionado los Pendientes en Clientes', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
                            else {
                                // Seleccionar las Ordenes de Compras que estan Pendientes con ese producto
                                that.m_ordenes_compra.listar_ordenes_compra_pendientes_by_producto(empresa_id, codigo_producto, function(err, pendientes_ordenes_compra) {

                                    if (err)
                                        res.send(G.utils.r(req.url, 'Error Seleccionado Las Ordenes de Compra Pendientes', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
                                    else {

                                        if (movimientos_producto.length > 0) {

                                            //Calcular la existencia inicial del producto

                                            that.m_kardex.obtener_existencia_inicial(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, function(err, existencia_inicial) {

                                                var stock_actual = 0;
                                                if (err)
                                                    res.send(G.utils.r(req.url, 'Error Calculando la Existencia Inicial del Producto', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
                                                else {
                                                    // Existencia Inicial del Producto
                                                    if (existencia_inicial.length > 0) {
                                                        stock_actual = parseInt(existencia_inicial[0]['existencia_inicial']);
                                                    }

                                                    movimientos_producto.forEach(function(movimiento) {


                                                        //Calcular stock del producto en un determinado movimiento.
                                                        var cantidad = parseInt(movimiento.cantidad);
                                                        //if (movimiento.tipo_movimiento === "E") {
                                                        if (movimiento.tipo === "EGRESO") {
                                                            stock_actual -= cantidad;

                                                        } else {
                                                            stock_actual += cantidad;

                                                        }
                                                        movimiento.stock_actual = stock_actual;


                                                        // Seleccionar los detalles de los movimientos del producto
                                                        that.m_kardex.obtener_detalle_movimientos_producto(empresa_id, movimiento.tipo_documento, movimiento.prefijo, movimiento.numero, function(err, detalle_movimiento) {

                                                            if (err) {
                                                                res.send(G.utils.r(req.url, 'Error Seleccionando el detalle del Movimiento', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}, pendientes_ordenes_compra: {}}));
                                                                return;
                                                            } else {

                                                                movimiento.detalle = detalle_movimiento[0];

                                                                if (--i === 0) {
                                                                    var obj = {movimientos_producto: movimientos_producto, pendientes_farmacias: pendientes_farmacias, pendientes_clientes: pendientes_clientes, pendientes_ordenes_compra: pendientes_ordenes_compra};
                                                                    //G.redis.setex("producto_"+codigo_producto,21600, JSON.stringify(obj));
                                                                 
                                                                    res.send(G.utils.r(req.url, 'Movimientos Producto!!!!!!!!', 200, obj));
                                                                }
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        } else {
                                            var obj = {movimientos_producto: movimientos_producto, pendientes_farmacias: pendientes_farmacias, pendientes_clientes: pendientes_clientes, pendientes_ordenes_compra: pendientes_ordenes_compra};
                                           // G.redis.setex("producto_"+codigo_producto,21600, JSON.stringify(obj));
                                            
                                            res.send(G.utils.r(req.url, 'Movimientos Producto', 200, obj));
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
       /*} else {
           console.log("result from cache for producto ",codigo_producto);
           res.send(G.utils.r(req.url, 'Movimientos Producto', 200, JSON.parse(result)));
       }*/
   // });
    
};


Kardex.prototype.consultarExistenciasProducto = function(req, res) {
    var that = this;

    var args = req.body.data;
    
       if (args.kardex === undefined || args.kardex.termino_busqueda === undefined || args.kardex.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.kardex.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }


    var termino_busqueda = args.kardex.termino_busqueda;
    var pagina_actual = args.kardex.pagina_actual;
    var empresa_id = args.kardex.empresa_id || '';
    
    G.Q.nfcall(this.m_productos.consultarExistenciasProducto,empresa_id, termino_busqueda, pagina_actual).
    then(function(lista_productos){
        res.send(G.utils.r(req.url, 'Listado de Productos!!!!', 200, {lista_productos: lista_productos}));
    }).
    fail(function(err){
       
        res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
    }).
    done();
    
};

Kardex.$inject = ["m_kardex", "m_pedidos_farmacias", "m_pedidos_clientes", "m_ordenes_compra", "m_productos"];

module.exports = Kardex;