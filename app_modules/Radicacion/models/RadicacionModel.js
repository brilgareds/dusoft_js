/* global G, archivo, query */

var RadicacionModel = function () {

};

RadicacionModel.prototype.listarConcepto = function (callback) {
    var query = G.knex.column('concepto_radicacion_id', 'observacion', 'estado')
            .select()
            .from('conceptos_radicacion')
            .orderBy('observacion', 'asc');
    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
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
            'b.tipo_mpio_id',
            'a.precio',
             G.knex.raw("to_char(a.fecha_entrega,'DD/MM/YYYY') as fecha_entrega"),
            'a.ruta',
             G.knex.raw("to_char(a.fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
            'c.observacion as proveedor',
            'a.descripcion',
            'b.municipio'
            )
            .select()
            .from("factura as a")
            .innerJoin("tipo_mpios as b",
                    function () {
                        this.on("a.tipo_mpio_id", "b.tipo_mpio_id")
                                .on("a.tipo_dpto_id","b.tipo_dpto_id")
                    })
            .innerJoin("conceptos_radicacion as c",
                    function () {
                        this.on("c.concepto_radicacion_id", "a.concepto_radicacion_id")
                    })
            .where('a.sw_entregado', 0)
            .orderBy('fecha_entrega', 'asc');

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarFactura]:", err);
        callback(err);
    });

};
RadicacionModel.prototype.listarAgrupar = function (obj, callback) {

    var query = G.knex.column(
             'a.relacion_id',
             'c.municipio',
             'b.numero_factura',
             'b.descripcion',
              G.knex.raw("to_char(b.fecha_entrega,'DD/MM/YYYY') as fecha_entrega"),
             'a.imprimir',
             'a.archivo',
             'a.factura_id',
             'b.sw_entregado')
            .select()
            .from("agrupar_factura as a")
            .innerJoin("factura as b", "a.factura_id", "b.factura_id")
            .innerJoin("tipo_mpios as c",
            
                   function () {
                        this.on("b.tipo_mpio_id", "c.tipo_mpio_id")
                                .on("b.tipo_dpto_id", "c.tipo_dpto_id")
                                .on("b.tipo_pais_id", "c.tipo_pais_id")
                                
                    })
            .where(function () {
                if (obj.relacion_id !== undefined) {
                    this.andWhere("a.relacion_id", obj.relacion_id)
                }
            }).orderBy("a.relacion_id");


    // .orderBy('fecha_entrega', 'asc');
//    console.log(G.sqlformatter.format(query.toString()));
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });

};




RadicacionModel.prototype.guardarConcepto = function (obj, callback) {

    var query = G.knex('conceptos_radicacion')
            .insert({observacion: obj.nombre
            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [guardarConcepto]: ", err);
        callback({err: err, msj: "Error al guardarConcepto"});
    });

};

RadicacionModel.prototype.subirArchivo = function (obj, callback) {


    if (!obj.req.files.file) {
        callback(false, {});
        return;
    }
    return  G.Q.ninvoke(G.utils, "subirArchivo", obj.req.files, true);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [subirArchivo]: ", err);
        callback({err: err, msj: "Error al subirArchivo"});
    });

};



RadicacionModel.prototype.factura = function (obj, callback) {

    var query = G.knex('factura')
            .insert({numero_factura: obj.numeroFactura,
                concepto_radicacion_id: obj.concepto_radicacion_id,
                sw_entregado: '0',
                tipo_mpio_id: obj.tipo_mpio_id,
                precio: obj.precio,
                tipo_pais_id: obj.tipo_pais_id,
                tipo_dpto_id: obj.tipo_dpto_id,
                fecha_entrega: 'now()',
                ruta: obj.ruta,
//              fecha_vencimiento: obj.fechaVencimiento,
                usuario_id: obj.usuario_id,
                descripcion:obj.concepto
            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [factura]: ", err);
        callback({err: err, msj: "Error de Factura"});
    });

};

RadicacionModel.prototype.modificarFactura = function (obj, callback) {
    console.log("modificarFactura....", obj)
    var update = {};
    
    if(obj.ruta){
        update = {
                concepto_radicacion_id: obj.conceptoSeleccionado,
                numero_factura: obj.numeroFactura,
                fecha_vencimiento: obj.fecha_entrega,
                precio: obj.precio,
                descripcion: obj.conceptooSeleccionado,
                tipo_mpio_id: obj.tipo_mpio_id,
                tipo_dpto_id: obj.tipo_dpto_id,
                ruta: obj.ruta
            };
    }else{
        update = {
                concepto_radicacion_id: obj.conceptoSeleccionado,
                numero_factura: obj.numeroFactura,
                fecha_vencimiento: obj.fecha_entrega,
                precio: obj.precio,
                descripcion: obj.conceptooSeleccionado,
                tipo_dpto_id: obj.tipo_dpto_id,
                tipo_mpio_id: obj.tipo_mpio_id
            };
    }
    var query = G.knex('factura')
            .where("factura_id", obj.factura_id)
            .update(update);

    query.then(function (resultado) {
        console.log("modificar factura",resultado)
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [modificarFactura]: ", err);
        callback({err: err, msj: "Error de modificarFactura"});
    });

};

RadicacionModel.prototype.modificarEntregado = function (obj, callback) {

    var query = G.knex('factura')
            .where("factura_id", obj.factura_id)
            .update({
                sw_entregado: obj.sw_entregado
            });
    //farmacias: obj.farmacias

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [modificarEntregado]: ", err);
        callback({err: err, msj: "Error de modificarEntregado"});
    });

};

RadicacionModel.prototype.modificarNombreArchivo = function (obj, callback) {

    var query = G.knex('agrupar_factura')
            .where("relacion_id", obj.relacion_id)
            .update({
                archivo: obj.archivo
            });
    //farmacias: obj.farmacias

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [modificarEntregado]: ", err);
        callback({err: err, msj: "Error de modificarEntregado"});
    });

};
RadicacionModel.prototype.eliminarGrupoFactura = function (obj, callback) {
console.log("obj.agrupar_factura_id",obj)
    var query = G.knex('agrupar_factura')
            .where('factura_id', obj.factura_id)
            .del();


    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [eliminarGrupoFactura]: ", err);
        callback({err: err, msj: "Error al eliminar los temporales"});
    });
};

RadicacionModel.prototype.agruparFacturaSecuencia = function (callback) {
    var query = G.knex.column(G.knex.raw("nextval('agrupar_factura_agrupar_factura_id_seq') as secuencia"))
            ;
    query.then(function (resultado) {

        callback(false, resultado[0].secuencia);
    }).catch(function (err) {
        console.log("err [agruparFacturaSecuencia]:", err);
        callback(err);
    });

};

RadicacionModel.prototype.insertAgruparFactura = function (obj, callback) {

    var query = G.knex('agrupar_factura')
            .insert({relacion_id: obj.secuencia,
                fecha_registro: 'now()',
                usuario_id: obj.usuario_id,
                factura_id: obj.factura_id

            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [agruparFactura]: ", err);
        callback({err: err, msj: "Error de Factura"});
    });

};

RadicacionModel.prototype.listarFacturaEntregado = function (callback) {
    var query = G.knex.column('	numero_factura', 'relacion_id')
            .select()
            .from('numero_factura')
            .orderBy('relacion_id', 'asc');
    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarFacturaAgrupada]:", err);
        callback(err);
    });

};

RadicacionModel.prototype.agregarFacturaEntregado = function (obj, callback) {
    var query = G.knex('agrupar_factura')
            .insert({relacion_id: obj.numeroRadicacion,
                fecha_registro: 'now()',
                usuario_id: obj.usuario_id,
                factura_id: obj.numeroFactura

            });

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [agregarFacturaEntregado]:", err);
        callback(err);
    });

};

RadicacionModel.prototype.planillaRadicacion = function (obj, callback) {

    var query = G.knex('agrupar_factura')
            .insert({relacion_id: obj.relacion_id
            });

    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [planillaRadicacion]:", err);
        callback(err);
    });

};

RadicacionModel.prototype.modificarDescarga = function (obj, callback) {

    var query = G.knex('agrupar_factura')
            .where("relacion_id", obj.relacion_id)
            .update({
                imprimir: 1
            });
    //farmacias: obj.farmacias

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err (/catch) [modificarDescarga]: ", err);
        callback({err: err, msj: "Error de modificarDescarga"});
    });

};

RadicacionModel.prototype.listarItemReporte = function (obj, callback) {
    var query = G.knex.column('	b.numero_factura',
    G.knex.raw("to_char(b.fecha_entrega,'DD/MM/YYYY') as fecha_entrega"),
    G.knex.raw("to_char(b.fecha_vencimiento,'DD/MM/YYYY') as fecha_vencimiento"),
    'b.precio',
    'b.descripcion',
    'c.observacion')
            .select()
            .from('agrupar_factura as a')
            .innerJoin("factura as b", "a.factura_id", "b.factura_id")
            .innerJoin("conceptos_radicacion as c", "b.concepto_radicacion_id", "c.concepto_radicacion_id")
            .where('relacion_id', obj.relacion_id);
    query.then(function (resultado) {

        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarFacturaAgrupada]:", err);
        callback(err);
    });

};


RadicacionModel.prototype.listarMunicipio = function(termino_busqueda, pais_id, callback) {


    var sql = " select \
                c.tipo_pais_id as pais_id,\
                c.pais as nombre_pais,\
                b.tipo_dpto_id as departamento_id,\
                b.departamento as nombre_departamento,\
                a.tipo_mpio_id as municipio_id,\
                a.municipio as nombre_ciudad\
                from tipo_mpios a \
                inner join tipo_dptos b on a.tipo_pais_id = b.tipo_pais_id and a.tipo_dpto_id = b.tipo_dpto_id\
                inner join tipo_pais c on b.tipo_pais_id = c.tipo_pais_id \
                where c.tipo_pais_id = :1";
    
    G.knex.raw(sql, {1:'CO'}).
    then(function(resultado){
       callback(false, resultado.rows, resultado);
    }).catch(function(err){
       callback(err);
    });
};

RadicacionModel.$inject = [];

module.exports = RadicacionModel;