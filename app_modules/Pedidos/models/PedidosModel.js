var PedidosModel = function(productos, pedidos_cliente, pedidos_farmacia) {

    this.m_productos = productos;
    this.m_pedidos_clientes = pedidos_cliente;
    this.m_pedidos_farmacias = pedidos_farmacia;
};

// Función para calcular la disponibilidad de un producto, teniendo en cuenta las "reservas"
PedidosModel.prototype.calcular_disponibilidad_producto = function(identificador, empresa_id, numero_pedido, codigo_producto, callback) {

    var that = this;

    var stock = 0;
    var cantidad_total_despachada = 0;
    var cantidad_total_solicitada = 0;
    var cantidad_despachada = 0;
    var disponible_bodega = 0;


    if (identificador === 'FM') {

        // Consulta el pedido de farmacia para obtener la fecha de registro
        that.m_pedidos_farmacias.consultar_pedido(numero_pedido, function(err, pedido) {

            pedido.forEach(function(datos) {

                var fecha_registro_pedido = datos.fecha_registro_pedido;
   
                // Se procede a consultar la cantidad TOTAL solicitada de ese producto en todos los pedidos
                // anteriores al pedido actual
                consultar_cantidad_total_solicitada_producto(empresa_id, codigo_producto, fecha_registro_pedido, function(err, cantidad_total) {

                    cantidad_total_solicitada = (cantidad_total.length === 1) ? cantidad_total[0].cantidad_solicitada : 0;

                    // Se procede a consultar la cantidad TOTAL despachada de ese producto en todos los pedidos
                    // anteriores al pedido actual
                    consultar_cantidad_total_productos_despachados(empresa_id, codigo_producto, fecha_registro_pedido, function(err, total_despachados) {

                        cantidad_total_despachada = (total_despachados.length === 1) ? total_despachados[0].cantidad_despachada : 0;

                        // Se consulta el detalle del pedido
                        that.m_pedidos_farmacias.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                            // Se extrae del pedido, el codigo seleccionado para conocer la cantidad que 
                            //ha sido despachada hasta el momento
                            var producto = detalle_pedido.filter(function(el) {
                                return el.codigo_producto === codigo_producto;
                            });
                            
                            //comentado por el ajuste de permitir el mismo producto varias veces en un item de despacho temporal
                           // cantidad_despachada = (producto.length === 1) ? producto[0].cantidad_despachada : 0;
                           cantidad_despachada = 0;
                           if(producto.length > 0){
                               for(var i in producto){
                                   cantidad_despachada += producto[i].cantidad_despachada;
                               }
                           }

                            // se consulta el total de existencias del producto seleccionado
                            that.m_productos.consultar_stock_producto(empresa_id, codigo_producto, function(err, stock_producto) {

                                stock = (stock_producto.length === 1) ? stock_producto[0].existencia : 0;

                                // Se aplica la Formula de Disponibilidad producto
                                disponible_bodega = parseInt(cantidad_total_despachada) +  parseInt(stock) -  parseInt(cantidad_total_solicitada) -  parseInt(cantidad_despachada);

                                console.log('============ Here =================');
                                console.log("codigo producto ", codigo_producto);
                                console.log('cantidad_total_despachada', cantidad_total_despachada);
                                console.log('stock', stock);
                                console.log('cantidad_total_solicitada', cantidad_total_solicitada);
                                console.log('cantidad_despachada', cantidad_despachada);
                                console.log('disponible_bodega', disponible_bodega);
                                console.log('fecha_registro', fecha_registro_pedido);
                                console.log('===================================');
                                
                                disponible_bodega = (disponible_bodega < 0) ? 0 : disponible_bodega;
                                disponible_bodega = (disponible_bodega > stock) ? stock : disponible_bodega;



                                callback(err, {codigo_producto: codigo_producto, disponible_bodega: disponible_bodega});

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

                // Se procede a consultar la cantidad TOTAL solicitada de ese producto en todos los pedidos
                // anteriores al pedido actual
                consultar_cantidad_total_solicitada_producto(empresa_id, codigo_producto, fecha_registro_pedido, function(err, cantidad_total) {


                    cantidad_total_solicitada = (cantidad_total.length === 1) ? cantidad_total[0].cantidad_solicitada : 0;

                    // Se procede a consultar la cantidad TOTAL despachada de ese producto en todos los pedidos
                    // anteriores al pedido actual
                    consultar_cantidad_total_productos_despachados(empresa_id, codigo_producto, fecha_registro_pedido, function(err, total_despachados) {

                        cantidad_total_despachada = (total_despachados.length === 1) ? total_despachados[0].cantidad_despachada : 0;

                        // Se consulta el detalle del pedido
                        that.m_pedidos_clientes.consultar_detalle_pedido(numero_pedido, function(err, detalle_pedido) {

                            // Se extrae del pedido, el codigo seleccionado para conocer la cantidad que 
                            //ha sido despachada hasta el momento
                            var producto = detalle_pedido.filter(function(el) {
                                return el.codigo_producto === codigo_producto;
                            });

                            //cantidad_despachada = (producto.length === 1) ? producto[0].cantidad_despachada : 0;
                            cantidad_despachada = 0;
                            if(producto.length > 0){
                               for(var i in producto){
                                   cantidad_despachada += producto[i].cantidad_despachada;
                               }
                            }

                            // se consulta el total de existencias del producto seleccionado
                            that.m_productos.consultar_stock_producto(empresa_id, codigo_producto, function(err, stock_producto) {

                                stock = (stock_producto.length === 1) ? stock_producto[0].existencia : 0;

                                // Se aplica la Formula de Disponibilidad producto
                                disponible_bodega = parseInt(cantidad_total_despachada) + parseInt(stock) - parseInt(cantidad_total_solicitada) - parseInt(cantidad_despachada);
                                console.log('disponible_bodega', disponible_bodega);
                                disponible_bodega = (disponible_bodega < 0) ? 0 : disponible_bodega;
                                disponible_bodega = (disponible_bodega > stock) ? stock : disponible_bodega;
                                
                                
                                 console.log('============ Here =================');
                                console.log("codigo producto ", codigo_producto);
                                console.log('cantidad_total_despachada', cantidad_total_despachada);
                                console.log('stock', stock);
                                console.log('cantidad_total_solicitada', cantidad_total_solicitada);
                                console.log('cantidad_despachada', cantidad_despachada);
                                console.log('disponible_bodega', disponible_bodega);
                                console.log('fecha_registro', fecha_registro_pedido);
                                console.log('===================================');

                                callback(err, {codigo_producto: codigo_producto, disponible_bodega: disponible_bodega});

                            });

                        });
                    });
                });
            });
        });
    }

};

// Funion que calcula cuales han sido los ultimo pedidos (Clientes / Farmacias ) en donde se 
// ha solicitado un producto deteminado
function consultar_cantidad_total_solicitada_producto(empresa_id, codigo_producto, fecha_registro_pedido, callback) {

    var that = this;

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
                ) as a where a.empresa_id= $1 and a.codigo_producto = $2 and a.fecha_registro < ( $3 )::timestamp \
                group by 1 ; ";
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(fecha_registro_pedido);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    
    G.db.query(sql, [empresa_id, codigo_producto, fecha_registro_pedido], function(err, rows, result) {
        callback(err, rows);
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
                ) as  a where a.empresa_id = $1 and a.codigo_producto=  $2 and a.fecha_registro <= ($3)\
                group by 1 order by 1 asc ; ";

    /*console.log(empresa_id, codigo_producto, fecha_registro_pedido, sql);
     return*/
    G.db.query(sql, [empresa_id, codigo_producto, fecha_registro_pedido], function(err, rows, result) {
        callback(err, rows);
    });
}
;


PedidosModel.$inject = ["m_productos", "m_pedidos_clientes", "m_pedidos_farmacias"];


module.exports = PedidosModel;