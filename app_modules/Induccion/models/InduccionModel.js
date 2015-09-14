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

InduccionModel.prototype.getListarCentroUtilidad = function(empresaId,callback){
  
    var column = [
                    "centro_utilidad",
                    "descripcion"
                ];

      G.knex.column(column)
            .select()
            .from('centro_utilidad')
            .where('empresa_id',empresaId)
            .limit(G.settings.limit)
            .then(function(rows) {
                callback(false, rows);
            })
            .catch (function(error) {
                callback(error);
            }).done();

    
};


module.exports = InduccionModel;