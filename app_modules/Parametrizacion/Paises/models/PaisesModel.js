var PaisesModel = function() {

};


PaisesModel.prototype.listar_paises = function(callback) {
    var columns = [
        "tipo_pais_id as pais_id",
        "pais as nombre_pais"
    ];
    
    G.knex.column(columns).
    from("tipo_pais").then(function(listaPaises){
        callback(false, listaPaises);
    }).catch(function(error){
        callback(error);
    }).done();
};

PaisesModel.prototype.seleccionar_pais = function(pais_id, callback) {

    var columns = [
        "tipo_pais_id as pais_id",
        "pais as nombre_pais"
    ];
    
    G.knex.column(columns).
    from("tipo_pais").where("tipo_pais_id", pais_id).then(function(listaPaises){
        callback(false, listaPaises);
    }).catch(function(error){
        callback(error);
    }).done();
};

module.exports = PaisesModel;