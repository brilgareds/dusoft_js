/* global G */

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



RadicacionModel.prototype.Factura = function(obj,callback){
    console.log("Fctura ",obj);
    var query = G.Knex('factura')
            .insert ({ numero_factura: obj.numero_factura,
                       concepto_id: obj.concepto_id,
                       sw_entregado: obj.sw_entregado,
                       bodega_id: obj.bodega_id,
                       precio: obj.precio,
                       fecha_entrega: obj.fecha_entrega,
                       ruta: obj.ruta,
                       fecha_vencimiento: obj.fecha_vencimiento
            });

    query.then(function(resultado){    
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [Factura]: ", err);
        callback({err:err, msj: "Error de Factura"});   
    });
    
};




RadicacionModel.$inject = [];

module.exports = RadicacionModel;