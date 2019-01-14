var rotacionModel = function () {

};
//AGREGAR ROTACION 
rotacionModel.prototype.rotacion = function (obj, callback) {
    var query = G.knex('registro_rotacion')
            .insert({fecha_rotacion: G.moment(obj.fecha_rotacion).format('DD/MM/YYYY'),
                fecha_digitacion: G.moment(obj.fecha_digitacion).format('DD/MM/YYYY'),
                empresa_id: obj.empresa_id,
                bodega_id: obj.bodega_id,
                zonas_id: obj.zonas_id
            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {

        callback({err: err, msj: "Error de rotacion"});
    });
};

//modificarRotacion
rotacionModel.prototype.modificarRotacion = function (obj, callback) {
    var query = G.knex('registro_rotacion')
            .where("id_registro", obj.id_registro)
            .update({
                fecha_rotacion: obj.fecha_rotacion,
                fecha_digitacion: obj.fecha_digitacion
            });
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback({err: err, msj: "Error de modificar rotacion"});
    });
};


rotacionModel.prototype.listarRotacion = function (obj,callback) {
    var query = G.knex.column('rr.empresa_id',
            'rr.bodega_id',
            'rr.id_registro',
            G.knex.raw("to_char(rr.fecha_rotacion,'DD/MM/YYYY') as fecha_rotacion"),
            G.knex.raw("to_char(rr.fecha_digitacion,'DD/MM/YYYY') as fecha_digitacion"),
            G.knex.raw("current_date - rr.fecha_rotacion as tiempo_transcurrido"),
            'rr.zonas_id',
            'b.descripcion as farmacias',
            'e.razon_social as empresas',
            'zb.descripcion as zonas')
            .select()
            .from('registro_rotacion as rr')
            .innerJoin("empresas as e", "rr.empresa_id", "e.empresa_id")
            .innerJoin("bodegas as b", function(){
             this.on("b.bodega", "rr.bodega_id").on("b.empresa_id","rr.empresa_id")
            })
            .innerJoin("zonas_bodegas as zb", "rr.zonas_id", "zb.id")
            .whereIn("rr.empresa_id",['FD','99','03'])
            .where("b.estado",1)
            .orderBy('tiempo_transcurrido', 'desc')
            
    .andWhere(function () {
        if(obj.buscar!==undefined && obj.buscar!=="")
            this.orWhere("b.descripcion",'ILIKE', "%" + obj.buscar + "%")
        if(obj.buscar!==undefined  && obj.buscar!=="")
            this.orWhere("zb.descripcion", 'ILIKE', "%" + obj.buscar + "%")
        if(obj.fecha_rotacion!==undefined && obj.fecha_rotacion!=="")
            this.orWhere("rr.fecha_rotacion", 'ILIKE', "%" + obj.fecha_rotacion + "%")
        if(obj.buscar!==undefined  && obj.buscar!=="")
            this.orWhere("e.razon_social", 'ILIKE', "%" + obj.buscar + "%")
    });
   

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
}; 


//listarempresas
rotacionModel.prototype.listarEmpresas = function (callback) {
    var query = G.knex
            .select()
            .from('empresas')
            .whereIn("empresa_id",['FD','99','03']);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {

        callback(err);
    });
};

//listarBODEGASS
rotacionModel.prototype.listarFarmacias = function (callback) {
    var query = G.knex
            .select()
            .from('bodegas')
            .whereIn("empresa_id",['FD','99','03']);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};
//listarZonas
rotacionModel.prototype.listarZonas = function (callback) {
    var query = G.knex
            .select()
            .from('zonas_bodegas');
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {

        callback(err);
    });
};


rotacionModel.prototype.eliminarRotacion = function (obj, callback) {
    var query = G.knex('registro_rotacion')
            .where('id_registro', obj.id_registro)
            .del();
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback({err: err, msj: "Error al eliminar rotación"});
    });
};

rotacionModel.$inject = [];
module.exports = rotacionModel;


