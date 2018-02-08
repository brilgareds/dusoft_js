var RadicacionModel = function() {

};

RadicacionModel.prototype.listarConcepto = function(callback){
       console.log("AA1111111");
     var query = G.knex.column('concepto_radicacion_id', 'observacion')
          .select()
          .from('conceptos_radicacion')
          .orderBy('observacion', 'asc');
          
      query.then(function(resultado){ 
             console.log("AA",resultado);
        callback(false, resultado);
    }).catch(function(err){    
        console.log("err [listarConcepto]:", err);
        callback(err);
    });
    
};

RadicacionModel.prototype.guardarConcepto = function(obj,callback){
      console.log("guardarConcepto ",obj); 
    var query = G.knex('conceptos_radicacion')
        .insert({observacion: obj.nombre
    });
        
    query.then(function(resultado){    
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [guardarConcepto]: ", err);
        callback({err:err, msj: "Error al guardarConcepto"});   
    });
    
};

RadicacionModel.$inject = [];

module.exports = RadicacionModel;