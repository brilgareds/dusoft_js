var Pedidos = function(pedidos, productos, m_pedidos_logs, j_pedidos, m_autorizaciones) {

    console.log("Modulo Pedidos Cargado ");

    this.m_pedidos = pedidos;
    this.m_productos = productos;
    this.m_pedidos_logs = m_pedidos_logs;
    this.m_autorizaciones = m_autorizaciones;
};


Pedidos.prototype.consultarDisponibilidadProducto = function(req, res) {

    var that = this;
    var args = req.body.data;

    if (args.pedidos === undefined || args.pedidos.empresa_id === undefined
        || args.pedidos.numero_pedido === undefined || args.pedidos.codigo_producto === undefined || args.pedidos.identificador === undefined
        || args.pedidos.centro_utilidad_id === undefined || args.pedidos.bodega_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos.empresa_id === '' || args.pedidos.numero_pedido === '' || args.pedidos.codigo_producto === '' || args.pedidos.identificador === ''
        || args.pedidos.centro_utilidad_id === '' || args.pedidos.bodega_id === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Vacíos ', 404, {}));
        return;
    }

    // Identificador FM=>Farmacias, CL=>Clientes
    if (args.pedidos.identificador !== 'FM' && args.pedidos.identificador !== 'CL') {
        res.send(G.utils.r(req.url, 'Identificador Desconocido ', 404, {}));
        return;
    }


    var empresa_id = args.pedidos.empresa_id;
    var codigo_producto = args.pedidos.codigo_producto;
    var numero_pedido = args.pedidos.numero_pedido;
    var identificador = args.pedidos.identificador; // FM o CL
    var centro_utilidad = args.pedidos.centro_utilidad_id;
    var bodega = args.pedidos.bodega_id;


    that.m_productos.consultar_existencias_producto(empresa_id, codigo_producto, centro_utilidad, bodega, {activos:true}, function(err, existencias_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
            return;
        }

        that.m_pedidos.calcular_disponibilidad_producto(identificador, empresa_id, numero_pedido, codigo_producto, function(err, disponibilidad) {
            if (err) {
                res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
                return;
            }
            res.send(G.utils.r(req.url, 'Lista Existencias Producto', 200, {
                existencias_producto: existencias_productos, 
                disponibilidad_bodega: disponibilidad.disponible_bodega,
                estado:disponibilidad.estado,
                stock:disponibilidad.stock
            }));
        });
    });
};

Pedidos.prototype.consultarLogs = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    args.pedidos = args.pedidos || {};
    var empresaId = args.pedidos.empresa_id || null;
    var numeroPedido = args.pedidos.numero_pedido || null;
    var tipoPedido = args.pedidos.tipo_pedido || null; // FM o CL


    if (!empresaId || !numeroPedido || !tipoPedido) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    
    G.Q.ninvoke(that.m_pedidos_logs, "consultarLogs", {empresaId:empresaId, numeroPedido:numeroPedido, tipoPedido:tipoPedido}).then(function(productos){
        res.send(G.utils.r(req.url, 'Listado de logs', 200, {productos:productos}));
    }).fail(function(err){
        console.log("ha ocurriod un error ",err);
        res.send(G.utils.r(req.url, 'Ha ocurrido un error', 500, {}));
    });
    
};

Pedidos.$inject = ["m_pedidos", "m_productos", "m_pedidos_logs", "j_pedidos", "m_autorizaciones"];

module.exports = Pedidos;