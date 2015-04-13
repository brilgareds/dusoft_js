var PlanillasDespachosModel = function() {

};


PlanillasDespachosModel.prototype.listar_planillas_despachos = function(termino_busqueda, callback) {


    var sql = "  ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

PlanillasDespachosModel.prototype.consultar_planilla_despacho = function(termino_busqueda, callback) {


    var sql = "  ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = PlanillasDespachosModel;