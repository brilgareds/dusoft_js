
var Kardex = function(kardex) {

    console.log("Modulo Kardex  Cargado ");

    this.m_kardex = kardex;

};

Kardex.prototype.index = function(req, res) {
    var that = this;
    this.m_kardex.sayHello(function(msj_kardex) {
        that.m_facturacion_clientes.sayHello(function(msj_facturacion_clientes) {
            res.send({kardex_dice: msj_kardex, facturacion_clientes_dice: msj_facturacion_clientes});
        });
    });
};


Kardex.prototype.listar_productos = function(req, res) {
    var that = this;

    var termino_busqueda = req.query.termino_busqueda;

    this.m_kardex.buscar_productos(termino_busqueda, function(err, rows) {
        res.send({err: err, rows: rows});
    });
};

Kardex.prototype.obtener_movimientos_producto = function(req, res) {
    
    var request_start = new Date();
    
    var that = this;

    var empresa_id = '03'; //req.query.empresa_id;
    var centro_utilidad_id = '1'; //req.query.centro_utilidad_id;
    var bodega_id = '03'; //req.query.bodega_id;
    var codigo_producto = '198A0010042'; //req.query.codigo_producto;
    var fecha_inicial = '2014-01-01 00:00:00'; //req.query.fecha_inicial;
    var fecha_final = '2014-01-31 24:00:00'; //req.query.fecha_final;

    this.m_kardex.obtener_movimientos_productos(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, fecha_inicial, fecha_final, function(err, rows) {
        var request_end = new Date();
        res.send({ tiempo_ejecucion : (request_end - request_start) ,total_registros : rows.length, registros : rows});
    });
};

Kardex.$inject = ["m_kardex"];

module.exports = Kardex;