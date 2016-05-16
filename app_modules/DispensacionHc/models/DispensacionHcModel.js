var DispensacionHcModel = function() {

    // Temporalmente
    //this.m_productos = productos;
};


DispensacionHcModel.prototype.listarFormulas = function(param, callback){
    
  var sql = "SELECT evolucion_id FROM hc_formulacion_antecedentes limit 10;";
  
  
  G.knex.raw(sql,[sql]).then(function(resultado){      
      callback(false, resultado.row)
  }).cathc(function(err){     
      callback(err)
  });
          
    
};

//DispensacionHcModel.$inject = ["m_productos"];


module.exports = DispensacionHcModel;