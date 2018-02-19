/* global G */

var RadicacionModel = function() {

};

RadicacionModel.prototype.listarConcepto = function(callback){
     var query = G.knex.column('concepto_radicacion_id', 'observacion', 'estado')
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

RadicacionModel.prototype.listarFactura = function (callback) {
    var query = G.knex.column(
            'a.factura_id',
            'a.numero_factura',
            'a.concepto_radicacion_id',
            'a.sw_entregado',
            'a.bodega_id',
            'a.precio',
            'a.fecha_entrega',
            'a.ruta',
            'a.fecha_vencimiento',
            'c.observacion',
            'b.descripcion'
            )
            .select()
            .from("factura as a")
            .innerJoin("bodegas as b",
                    function () {
                        this.on("a.bodega_id", "b.bodega")
                    })
            .innerJoin("conceptos_radicacion as c",
                    function () {
                        this.on("c.concepto_radicacion_id", "a.concepto_radicacion_id")
                    })
            .orderBy('fecha_entrega', 'asc');
    query.then(function (resultado) {
        console.log("AA", resultado);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarFactura]:", err);
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

//RadicacionModel.prototype.subirArchivo = function(obj,callback){



RadicacionModel.prototype.factura = function(obj,callback){
    console.log("factura ",obj);
    var query = G.knex('factura')
               .insert ({ numero_factura: obj.numeroFactura,
                       concepto_radicacion_id: obj.concepto_radicacion_id,
                       sw_entregado: obj.sw_entregado,
                       bodega_id: obj.bodega_id,
                       precio: obj.precio,
                       fecha_entrega: 'now()',
                       ruta: obj.ruta,
                       fecha_vencimiento: obj.fechaVencimiento,
                       usuario_id: obj.usuario_id
            });
            
    query.then(function(resultado){    
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [factura]: ", err);
        callback({err:err, msj: "Error de Factura"});   
    });
    
};


	








RadicacionModel.$inject = [];

module.exports = RadicacionModel;