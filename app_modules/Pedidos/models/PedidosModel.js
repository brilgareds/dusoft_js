var PedidosModel = function(productos, pedidos_cliente, pedidos_farmacia) {

    this.m_productos = productos;
    this.m_pedidos_clientes = pedidos_cliente;
    this.m_pedidos_farmacias = pedidos_farmacia;
};

// Función para calcular la disponibilidad de un producto, teniendo en cuenta las "reservas"
PedidosModel.prototype.calcular_disponibilidad_producto = function(identificador, empresa_id, numero_pedido, codigo_producto, callback) {

    var that = this;

    var stock = 0;
    var cantidad_total_pendiente = 0;
    var cantidad_total_despachada = 0;
    var cantidad_total_solicitada = 0;
    var cantidad_despachos = 0;
    var cantidad_despachada = 0;
    var disponible_bodega = 0;
    var cantidad_reservada_temporales = 0;



    if (identificador === 'FM') {

        // Consulta el pedido de farmacia para obtener la fecha de registro
        that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, pedido) {

            pedido.forEach(function(datos) {

                var fecha_registro_pedido = datos.fecha_registro_pedido;


                consultar_cantidad_total_pendiente_producto(empresa_id, codigo_producto, fecha_registro_pedido, function(err, cantidad_total) {

                    cantidad_total_pendiente = (cantidad_total.length === 1) ? cantidad_total[0].cantidad_total_pendiente : 0;


                    //cantidad reservada para cotizaciones
                    that.m_pedidos_farmacias.calcular_cantidad_reservada_temporales_farmacias_por_fecha(codigo_producto, fecha_registro_pedido, function(err, total_reservado_temporales) {

                        var cantidad_temporal_farmacia = (total_reservado_temporales.length > 0) ? total_reservado_temporales[0].total_reservado : 0;


                        that.m_pedidos_clientes.calcular_cantidad_reservada_cotizaciones_clientes_por_fecha(codigo_producto, fecha_registro_pedido, function(err, total_reservado_cotizaciones) {

                            var cantidad_temporal_clientes = (total_reservado_cotizaciones.length > 0) ? total_reservado_cotizaciones[0].total_reservado : 0;


                            cantidad_reservada_temporales = cantidad_temporal_farmacia + cantidad_temporal_clientes;
                            // Se consulta el detalle del pedido
                            that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                                // Se extrae del pedido, el codigo seleccionado para conocer la cantidad que
                                //ha sido despachada hasta el momento
                                var producto = detalle_pedido.filter(function(el) {
                                    return el.codigo_producto === codigo_producto;
                                });

                                cantidad_despachada = 0;
                                cantidad_despachos = 0;

                                if (producto.length > 0) {
                                    for (var i in producto) {
                                        cantidad_despachada = parseInt(producto[i].cantidad_despachada_real);
                                        cantidad_despachos += parseInt(producto[i].cantidad_temporalmente_separada);
                                    }
                                }

                                cantidad_despachada = cantidad_despachada + cantidad_despachos;

                                // se consulta el total de existencias del producto seleccionado
                                that.m_productos.consultar_stock_producto(empresa_id, codigo_producto, {}, function(err, stock_producto) {
                                    stock = (stock_producto.length === 1) ? stock_producto[0].existencia : 0;

                                    //Producto bloqueado por compras, stock se deja en 0 para la formula de disponible
                                    if (stock_producto[0].estado === '0') {
                                        stock = 0;
                                    }

                                    // Se aplica la Formula de Disponibilidad producto
                                    //Se agrega validacion para casos especiales donde el stock es igual a la cantidad despachada de un pedido con pendientes
                                    //12-04-2016
                                    if (parseInt(cantidad_despachada) === parseInt(stock)) {
                                        cantidad_despachada = 0;
                                    }

                                    disponible_bodega = parseInt(stock) - parseInt(cantidad_total_pendiente) - parseInt(cantidad_despachada) - parseInt(cantidad_reservada_temporales);

                                    console.log('============ Here =================');
                                    console.log("empresa ", empresa_id);
                                    console.log("stock real ", stock_producto);
                                    console.log("codigo producto ", codigo_producto);
                                    console.log('stock', stock);
                                    console.log("cantidad_total_pendiente ", cantidad_total_pendiente);
                                    console.log('cantidad_despachada', cantidad_despachada);
                                    console.log('disponible_bodega', disponible_bodega);
                                    console.log("cantidad_reservada_temporales", cantidad_reservada_temporales);
                                    console.log('fecha_registro', fecha_registro_pedido);
                                    console.log('===================================');


                                    disponible_bodega = (disponible_bodega < 0) ? 0 : disponible_bodega;
                                    disponible_bodega = (disponible_bodega > stock) ? stock : disponible_bodega;

                                    callback(err, {
                                        codigo_producto: codigo_producto,
                                        disponible_bodega: disponible_bodega,
                                        estado: stock_producto[0].estado,
                                        //Se regresa el stock asi el producto este inactivo.
                                        stock: (stock_producto.length === 1) ? stock_producto[0].existencia : 0
                                    }
                                    );
                                });
                            });

                        });

                    });

                });
            });
        });
    } else {

        // Consulta el pedido de clintes para obtener la fecha de registro
        that.m_pedidos_clientes.consultar_pedido(numero_pedido, function(err, pedido) {

            pedido.forEach(function(datos) {

                var fecha_registro_pedido = datos.fecha_registro;


                consultar_cantidad_total_pendiente_producto(empresa_id, codigo_producto, fecha_registro_pedido, function(err, cantidad_total) {

                    cantidad_total_pendiente = (cantidad_total.length === 1) ? cantidad_total[0].cantidad_total_pendiente : 0;



                    that.m_pedidos_farmacias.calcular_cantidad_reservada_temporales_farmacias_por_fecha(codigo_producto, fecha_registro_pedido, function(err, total_reservado_temporales) {

                        var cantidad_temporal_farmacia = (total_reservado_temporales.length > 0) ? total_reservado_temporales[0].total_reservado : 0;

                        that.m_pedidos_clientes.calcular_cantidad_reservada_cotizaciones_clientes_por_fecha(codigo_producto, fecha_registro_pedido, function(err, total_reservado_cotizaciones) {

                            var cantidad_temporal_clientes = (total_reservado_cotizaciones.length > 0) ? total_reservado_cotizaciones[0].total_reservado : 0;

                            cantidad_reservada_temporales = cantidad_temporal_farmacia + cantidad_temporal_clientes;

                            // Se consulta el detalle del pedido
                            that.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                                // Se extrae del pedido, el codigo seleccionado para conocer la cantidad que
                                //ha sido despachada hasta el momento
                                var producto = detalle_pedido.filter(function(el) {
                                    return el.codigo_producto === codigo_producto;
                                });

                                //cantidad_despachada = (producto.length === 1) ? producto[0].cantidad_despachada : 0;
                                cantidad_despachada = 0;
                                if (producto.length > 0) {
                                    for (var i in producto) {
                                        cantidad_despachada += producto[i].cantidad_despachada;
                                    }
                                }

                                // se consulta el total de existencias del producto seleccionado
                                that.m_productos.consultar_stock_producto(empresa_id, codigo_producto, {}, function(err, stock_producto) {

                                    stock = (stock_producto.length === 1) ? stock_producto[0].existencia : 0;

                                    //Producto bloqueado por compras, stock se deja en 0 para la formula de disponible
                                    if (stock_producto[0].estado === '0') {
                                        stock = 0;
                                    }
                                    // Se aplica la Formula de Disponibilidad producto
                                    //Se agrega validacion para casos especiales donde el stock es igual a la cantidad despachada de un pedido con pendientes
                                    // //12-04-2016
                                    if (parseInt(cantidad_despachada) === parseInt(stock)) {
                                        cantidad_despachada = 0;
                                    }

                                    disponible_bodega = parseInt(stock) - parseInt(cantidad_total_pendiente) - parseInt(cantidad_despachada) - cantidad_reservada_temporales;

                                    disponible_bodega = (disponible_bodega < 0) ? 0 : disponible_bodega;
                                    disponible_bodega = (disponible_bodega > stock) ? stock : disponible_bodega;


                                    console.log('============ Here =================');
                                    console.log("codigo producto ", codigo_producto);
                                    console.log('stock', stock);
                                    console.log("cantidad_total_pendiente ", cantidad_total_pendiente);
                                    console.log('cantidad_despachada', cantidad_despachada);
                                    console.log('fecha_registro', fecha_registro_pedido);
                                    console.log('disponible_bodega', disponible_bodega);
                                    console.log("cantidad_reservada_temporales", cantidad_reservada_temporales);
                                    console.log('===================================');

                                    callback(err, {
                                        codigo_producto: codigo_producto,
                                        disponible_bodega: disponible_bodega,
                                        estado: stock_producto[0].estado,
                                        //Se regresa el stock asi el producto este inactivo.
                                        stock: (stock_producto.length === 1) ? stock_producto[0].existencia : 0
                                    }
                                    );

                                });

                            });

                        });
                    });

                });
            });
        });
    }

};


PedidosModel.prototype.unificarLotesDetalle = function(detalle) {
    var that = this;
    for (var i in detalle) {
        var lote = detalle[i];

        for (var ii in detalle) {
            var _lote = detalle[ii];
            //se unifica el lote
            if (_lote.codigo_producto === lote.codigo_producto && lote.item_id !== _lote.item_id) {
                lote.cantidad_ingresada += _lote.cantidad_ingresada;
                lote.cantidad_pendiente -= _lote.cantidad_ingresada;

                if (lote.auditado === '1') {
                    lote.auditado = _lote.auditado;
                }

                detalle.splice(ii, 1);
                that.unificarLotesDetalle(detalle);
                break;
            }
        }

    }

    return detalle;
};

// Funcion que calcula cuales han sido los ultimo pedidos (Clientes / Farmacias ) en donde se
// ha solicitado un producto deteminado
function consultar_cantidad_total_solicitada_producto(empresa_id, codigo_producto, fecha_registro_pedido, callback) {

    var sql = " select codigo_producto, sum(cantidad)::integer as cantidad_solicitada from (\
                    SELECT a.empresa_destino as empresa_id, a.fecha_registro, b.codigo_producto, sum(b.cantidad_solic) as cantidad, 1\
                    FROM   solicitud_productos_a_bodega_principal a\
                    inner join solicitud_productos_a_bodega_principal_detalle b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id\
                    GROUP BY 1,2,3\
                    union\
                    select a.empresa_id, a.fecha_registro, b.codigo_producto, sum(b.numero_unidades) AS cantidad, 2\
                    from ventas_ordenes_pedidos a\
                    inner join ventas_ordenes_pedidos_d b on a.pedido_cliente_id = b.pedido_cliente_id\
                    GROUP BY  1,2,3\
                ) as a where a.empresa_id= :1 and a.codigo_producto = :2 and a.fecha_registro < ( :3 )::timestamp \
                group by 1 ; ";

    G.knex.raw(sql, {1: empresa_id, 2: codigo_producto, 3: fecha_registro_pedido}).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });

}
;

// Funcion que calcual la cantidad total que ha sido despachada de un producto
function consultar_cantidad_total_productos_despachados(empresa_id, codigo_producto, fecha_registro_pedido, callback) {


    var sql = " select codigo_producto, sum (cantidad_despachada)::integer as cantidad_despachada from (\
                    select a.empresa_destino as empresa_id, a.fecha_registro, b.codigo_producto, COALESCE(SUM(b.cantidad_solic - b.cantidad_pendiente)::integer,0) as cantidad_despachada,  1 \
                    from solicitud_productos_a_bodega_principal a\
                    inner join solicitud_productos_a_bodega_principal_detalle b on a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id \
                    group by 1,2,3\
                    union \
                    select a.empresa_id, a.fecha_registro , b.codigo_producto, sum( b.cantidad_despachada ) as cantidad_despachada,  2\
                    from ventas_ordenes_pedidos a\
                    inner join ventas_ordenes_pedidos_d b on a.pedido_cliente_id = b.pedido_cliente_id\
                    group by 1,2,3\
                ) as  a where a.empresa_id = :1 and a.codigo_producto=  :2 and a.fecha_registro <= ( :3 )\
                group by 1 order by 1 asc ; ";


    G.knex.raw(sql, {1: empresa_id, 2: codigo_producto, 3: fecha_registro_pedido}).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
}
;

// Consultar la cantidad total pendiente de un producto
function consultar_cantidad_total_pendiente_producto(empresa_id, codigo_producto, fecha_registro_pedido, callback) {

    var sql = " select coalesce(sum(cantidad_total_pendiente), 0) as cantidad_total_pendiente \
                from (\
                  select b.codigo_producto, coalesce(SUM( b.cantidad_pendiente),0) AS cantidad_total_pendiente\
                  from solicitud_productos_a_bodega_principal a \
                  inner join solicitud_productos_a_bodega_principal_detalle b ON a.solicitud_prod_a_bod_ppal_id = b.solicitud_prod_a_bod_ppal_id    \
                  where a.empresa_destino = :1 and b.codigo_producto = :2 and b.cantidad_pendiente > 0 \
                  and a.fecha_registro < :3 GROUP BY 1\
                  union\
                  SELECT\
                  b.codigo_producto,\
                  coalesce(SUM((b.numero_unidades - b.cantidad_despachada)),0) as cantidad_total_pendiente\
                  FROM ventas_ordenes_pedidos a\
                  inner join ventas_ordenes_pedidos_d b ON a.pedido_cliente_id = b.pedido_cliente_id\
                  where a.empresa_id = :1 and b.codigo_producto = :2 and (b.numero_unidades - b.cantidad_despachada) > 0  \
                  and a.fecha_registro < :3 and a.estado = '1' GROUP BY 1\
                ) as a";

    G.knex.raw(sql, {1: empresa_id, 2: codigo_producto, 3: fecha_registro_pedido}).
            then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });

}
;

/*
 * @Author: Andres M. Gonzalez
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Funcion publica donde inicializa la funcion recursiva para almacenar la autorizacion
 */
PedidosModel.prototype.guardarAutorizacion = function(parametros, callback) {

    __guardarAutorizacionesProductosPedidos(parametros, function(err, resultado) {
        if (err) {
            callback(err, resultado);
        } else {
            callback(false);
        }
    });
};

/*
 * @Author: Andres M. Gonzalez
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Funcion que inserta en la tabla autorizaciones_productos_pedidos
 *               los productos que se van autorizar
 */
function __insertarAutorizacionesProductosPedido(params, callback) {
    var sql = "INSERT INTO autorizaciones_productos_pedidos(\n\
                    tipo_pedido,\n\
                    pedido_id,\n\
                    codigo_producto,\n\
                    fecha_solicitud,\n\
                    empresa_id,\n\
                    estado)\n\
                VALUES( :1, :2, :3, CURRENT_TIMESTAMP, :5,:6)";
    var query = G.knex.raw(sql, {1: params.farmacia, 2: params.numero_pedido, 3: params.productos[0].codigo_producto, 5: params.empresa_id, 6: '0'});

    query.then(function(resultado) {
        callback(false, resultado.rows);
    }). catch (function(err) {
        callback(err);
    });
}
;

/*
 * @Author: Andres M. Gonzalez
 * @param {Object} params
 * @param {function} callback
 * +Descripcion: Funcion recursiva que permite crear los poductos por autorizar
 */
function __guardarAutorizacionesProductosPedidos(params, callback) {

    var producto = params.productos[0];
    var def = G.Q.defer();
    if (!producto) {
        callback(false);
        return;
    }
    if (params.productos[0].bloqueado === '0') {
        G.Q.nfcall(__insertarAutorizacionesProductosPedido, params)
                .then(function(resultado) {
            setTimeout(function() {
                params.productos.splice(0, 1);
                __guardarAutorizacionesProductosPedidos(params, callback);
                def.resolve();
            }, 0);
        }).fail(function(err) {
            callback(err);
        });
    } else {
        params.productos.splice(0, 1);
        callback(false);
    }
}

PedidosModel.$inject = ["m_productos", "m_pedidos_clientes", "m_pedidos_farmacias"];


module.exports = PedidosModel;