var SincronizacionDocumentosModel = function() {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function(obj, callback) {
    console.log('entro en el modelo!');
    
    var sql = knex.select('prefijo', 'tipo_doc_general_id', 'texto1')
            .from('documentos')
            .where(function(){
                this.andWhere('empresa_id', obj.empresaId)
            })
            .orderBy('tipo_doc_general_id');
    
    var query = G.knex.raw(sql, {1: obj.autorizacionId});
    query.then(function(resultado) {
       callback(false, resultado.rows);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

module.exports = SincronizacionDocumentosModel;