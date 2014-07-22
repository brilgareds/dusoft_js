
var Productos = function(productos) {

    console.log("Modulo Productos  Cargado ");

    this.m_productos = productos;
};


Productos.prototype.listar_productos = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.productos.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var termino_busqueda = args.productos.termino_busqueda;
    var pagina_actual = args.productos.pagina_actual;


    this.m_productos.buscar_productos(termino_busqueda, pagina_actual, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};


Productos.prototype.consultarExistenciasProducto = function(req, res) {

    var that = this;


    var empresa_id = '03';
    var centro_utilidad_id = '1';
    var bodega_id = '03';
    var codigo_producto = '168D0501607';

    that.m_productos.consultar_existencias_producto(empresa_id, codigo_producto, function(err, existencias) {
        console.log(existencias);
    });
};



Productos.$inject = ["m_productos"];

module.exports = Productos;