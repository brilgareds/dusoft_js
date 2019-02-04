var SincronizacionDocumentosModel = function() {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function(obj, callback) {
    console.log('entro en el modelo!',obj);
    console.log('entro en el modelo!',obj.empresaId);
    
    var query = G.knex.select(['a.prefijo', 'a.tipo_doc_general_id', 'a.texto1'])
            .from('documentos as a')
            .where(function(){
            }).andWhere('empresa_id', obj.empresaId)
              .orderBy('tipo_doc_general_id');
      console.log(G.sqlformatter.format(query.toString()));
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

module.exports = SincronizacionDocumentosModel;