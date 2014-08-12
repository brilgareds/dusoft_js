var Pedidos = function(pedidos, productos) {

    console.log("Modulo Pedidos Cargado ");

    this.m_pedidos = pedidos;
    this.m_productos = productos;
};


Pedidos.prototype.consultarDisponibilidadProducto = function(req, res) {

    var that = this;
    var args = req.body.data;

    if (args.pedidos === undefined || args.pedidos.empresa_id === undefined ||
            args.pedidos.numero_pedido === undefined || args.pedidos.codigo_producto === undefined || args.pedidos.identificador === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    if (args.pedidos.empresa_id === '' || args.pedidos.numero_pedido === '' || args.pedidos.codigo_producto === '' || args.pedidos.identificador === '') {
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


    that.m_productos.consultar_existencias_producto(empresa_id, codigo_producto, function(err, existencias_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
            return;
        }

        that.m_pedidos.calcular_disponibilidad_producto(identificador, empresa_id, numero_pedido, codigo_producto, function(err, disponibilidad) {
            if (err) {
                res.send(G.utils.r(req.url, 'Se Ha Generado Un Error Interno', 500, {}));
                return;
            }
            res.send(G.utils.r(req.url, 'Lista Existencias Producto', 200, {existencias_producto: existencias_productos, disponibilidad_bodega: disponibilidad.disponible_bodega}));
        });
    });
};

Pedidos.$inject = ["m_pedidos", "m_productos"];

module.exports = Pedidos;