
var Kardex = function(kardex) {

    console.log("Modulo Kardex  Cargado ");

    this.m_kardex = kardex;

};


Kardex.prototype.listar_productos = function(req, res) {
    var that = this;

    var termino_busqueda = (req.query.termino_busqueda === undefined) ? '' : req.query.termino_busqueda;

    this.m_kardex.buscar_productos(termino_busqueda, function(err, lista_productos) {
        res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
    });
};

Kardex.prototype.obtener_movimientos_producto = function(req, res) {

    var that = this;

    var empresa_id = '03'; //req.query.empresa_id;
    var centro_utilidad_id = '1'; //req.query.centro_utilidad_id;
    var bodega_id = '03'; //req.query.bodega_id;
    var codigo_producto = req.query.codigo_producto;//'198A0010042';//
    var fecha_inicial = req.query.fecha_inicial; //'2014-01-01';//
    var fecha_final = req.query.fecha_final; //'2014-01-31';//
    
    /*console.log(codigo_producto);
    console.log(fecha_inicial);
    console.log(fecha_final);
    return;*/

    this.m_kardex.obtener_movimientos_productos(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, function(err, movimientos_producto) {

        if (err)
            res.send(G.utils.r(req.url, 'Error Seleccionado los Movimientos del Producto', 500, {movimientos_producto: {}}));
        else
            res.send(G.utils.r(req.url, 'Movimientos Producto', 200, {movimientos_producto: movimientos_producto}));
    });
};

Kardex.$inject = ["m_kardex"];

module.exports = Kardex;