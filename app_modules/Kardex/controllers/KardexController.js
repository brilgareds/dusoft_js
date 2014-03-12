
var Kardex = function(kardex, pedidos_farmacias, pedidos_clientes) {

    console.log("Modulo Kardex  Cargado ");

    this.m_kardex = kardex;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
};


Kardex.prototype.listar_productos = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.kardex === undefined || args.kardex.termino_busqueda === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = args.kardex.termino_busqueda;


    this.m_kardex.buscar_productos(termino_busqueda, function(err, lista_productos) {
        res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
    });
};

Kardex.prototype.obtener_movimientos_producto = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.kardex === undefined || args.kardex.fecha_inicial === undefined || args.kardex.fecha_final === undefined || args.kardex.codigo_producto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.kardex.codigo_producto === "" || args.kardex.fecha_inicial === "" || args.kardex.fecha_final === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacios', 404, {}));
        return;
    }

    var empresa_id = '03'; //req.query.empresa_id;
    var centro_utilidad_id = '1'; //req.query.centro_utilidad_id;
    var bodega_id = '03'; //req.query.bodega_id;
    var codigo_producto = args.kardex.codigo_producto;//'198A0010042';//
    var fecha_inicial = args.kardex.fecha_inicial; //'2014-01-01';//
    var fecha_final = args.kardex.fecha_final; //'2014-01-31';//

    /*console.log(codigo_producto);
    console.log(fecha_inicial);
    console.log(fecha_final);
    return;*/

    this.m_kardex.obtener_movimientos_productos(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, function(err, movimientos_producto) {

        var i = movimientos_producto.length;

        if (err)
            res.send(G.utils.r(req.url, 'Error Seleccionado los Movimientos del Producto', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}}));
        else {

            that.m_pedidos_farmacias.listar_pedidos_pendientes_by_producto(empresa_id, codigo_producto, function(err, pendientes_farmacias) {

                if (err)
                    res.send(G.utils.r(req.url, 'Error Seleccionado los Pendientes en Farmacias', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}}));
                else {

                    that.m_pedidos_clientes.listar_pedidos_pendientes_by_producto(empresa_id, codigo_producto, function(err, pendientes_clientes) {
                        if (err)
                            res.send(G.utils.r(req.url, 'Error Seleccionado los Pendientes en Clientes', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}}));
                        else {

                            if (movimientos_producto.length > 0) {
                                movimientos_producto.forEach(function(movimiento) {
                                    that.m_kardex.obtener_detalle_movimientos_producto(empresa_id, movimiento.tipo_documento, movimiento.prefijo, movimiento.numero, function(err, detalle_movimiento) {

                                        if (err) {
                                            res.send(G.utils.r(req.url, 'Error Seleccionado el detalle del Movimiento', 500, {movimientos_producto: {}, pendientes_farmacias: {}, pendientes_clientes: {}}));
                                            return;
                                        } else {

                                            movimiento.detalle = detalle_movimiento[0];

                                            if (--i === 0) {
                                                res.send(G.utils.r(req.url, 'Movimientos Producto', 200, {movimientos_producto: movimientos_producto, pendientes_farmacias: pendientes_farmacias, pendientes_clientes: pendientes_clientes}));
                                            }
                                        }

                                    });
                                });
                            } else {
                                res.send(G.utils.r(req.url, 'Movimientos Producto', 200, {movimientos_producto: movimientos_producto, pendientes_farmacias: pendientes_farmacias, pendientes_clientes: pendientes_clientes}));
                            }
                        }
                    });
                }
            });
        }
    });
};

Kardex.$inject = ["m_kardex", "m_pedidos_farmacias", "m_pedidos_clientes"];

module.exports = Kardex;