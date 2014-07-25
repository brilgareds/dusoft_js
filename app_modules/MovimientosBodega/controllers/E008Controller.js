
var E008Controller = function(movientos_bodegas, e008_sql) {

    this.m_movientos_bodegas = movientos_bodegas;
    this.m_e008 = e008_sql;
};

E008Controller.prototype.documentoTemporalClientes = function(req, res) {


    var that = this;


    that.m_e008.ingresar_despacho_clientes_temporal(bodegas_doc_id, numero_pedido, tipo_tercero_id, tercero_id, observacion, usuario_id, function() {
        
        that.m_movientos_bodegas.ingresar_detalle_movimiento_bodega_temporal(argumentos, argumento, function(){
            
        });
    });
};

E008Controller.prototype.documentoTemporalFarmacias = function(req, res) {


    var that = this;


    that.m_e008.ingresar_despacho_farmacias_temporal();


};

E008Controller.$inject = ["m_movientos_bodegas", "m_e008"];

module.exports = E008Controller;