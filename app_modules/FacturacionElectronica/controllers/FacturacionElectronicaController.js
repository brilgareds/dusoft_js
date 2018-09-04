
var FacturacionElectronica = function(m_facturacion_electronica) {
   
    this.m_facturacion_electronica = m_facturacion_electronica;
};


// Listar las ordenes de compra
FacturacionElectronica.prototype.listarOrdenesCompra = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.ordenes_compras === undefined || args.ordenes_compras.fecha_inicial === undefined || args.ordenes_compras.fecha_final === undefined) {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.termino_busqueda === undefined || args.ordenes_compras.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'termino_busqueda, pagina_actual no estan definidas', 404, {}));
        return;
    }

    if (args.ordenes_compras.fecha_inicial === '' || args.ordenes_compras.fecha_final === '') {
        res.send(G.utils.r(req.url, 'fecha_inicial, fecha_final estan vacias', 404, {}));
        return;
    }

    if (args.ordenes_compras.pagina_actual === '' || args.ordenes_compras.pagina_actual === 0 || args.ordenes_compras.pagina_actual === '0') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }
 
    
    var parametros = {fecha_inicial:args.ordenes_compras.fecha_inicial, 
	fecha_final:args.ordenes_compras.fecha_final, 
	termino_busqueda:args.ordenes_compras.termino_busqueda, 
	pagina_actual:args.ordenes_compras.pagina_actual, 
	filtro:args.ordenes_compras.filtro || undefined,
	sw_recepcion: args.ordenes_compras.sw_recepcion 
    };

    G.Q.ninvoke(that.m_ordenes_compra, "listar_ordenes_compra",parametros).
    then(function(resultado){
        
        res.send(G.utils.r(req.url, 'Lista Ordenes Compras', 200, {ordenes_compras: resultado}));
    }).fail(function(err){
        
        res.send(G.utils.r(req.url, 'Error Interno', 500, {ordenes_compras: []}));
        
    }).done();

};

FacturacionElectronica.$inject = ["m_facturacion_electronica"];

module.exports = FacturacionElectronica;