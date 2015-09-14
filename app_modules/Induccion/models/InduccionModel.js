var InduccionModel = function() {

};

InduccionModel.prototype.getListarEmpresas = function(callback){
  
    var column = [
                    "empresa_id",
                    "razon_social"
         ];

      G.knex.column(column)
            .select()
            .from('empresas')
            .limit(G.settings.limit)
            .then(function(rows) {
                callback(false, rows);
            })
            .catch (function(error) {
                callback(error);
            }).done();

    
};


module.exports = InduccionModel;