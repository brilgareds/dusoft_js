/* global G, archivo, query */

var PreciosProductosModel = function () {

};

PreciosProductosModel.prototype.listarConcepto = function (callback) {
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

PreciosProductosModel.prototype.listarFactura = function (callback) {
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

PreciosProductosModel.prototype.listarDocumentosAjustes = function (obj, callback) {
    //console.log('Object in function "listarDocumentosAjustes": ',obj);
    var codigo_producto = obj.relacion_id.toUpperCase();
    var fecha_ini = obj.fecha_ini+' 00:00:00';
    var fecha_fin = obj.fecha_fin+' 23:59:59';
    var prefijo = obj.prefijo;
    var filtro = obj.filtro;
    var empresa_id = obj.empresa_id;
    var magnitud_item = 20;
    var offset_num = 0;

    if(obj.paginaActualDocumentos > 0){
        offset_num = (obj.paginaActualDocumentos-1)*magnitud_item;
    }

    //console.log('Entry in function "listarDocumentosAjustes"');

    if(filtro == 'Molecula'){
        filtroWhere = 'a.descripcion';

        var campos = [
            'd.numeracion',
            'a.subclase_id',
            'c.*',
            'd.prefijo',
            G.knex.raw('split_part(c.aprobacion, \' \', 1) as aprobacion1'),
            G.knex.raw('split_part(c.aprobacion, \' \', 2) as aprobacion2'),
            G.knex.raw('fc_descripcion_producto(c.producto_id) as descripcion')
        ];

        var query = G.knex.column(campos).select()
            .from('inv_subclases_inventarios as a')
            .innerJoin('inventarios_productos as b', 'a.subclase_id', 'b.subclase_id')
            .innerJoin('inv_bodegas_ajuste_precio as c', 'b.codigo_producto', 'c.producto_id')
            .innerJoin('documentos as d', 'c.documento_id', 'd.documento_id')
            .where(function() {
                if(codigo_producto != ''){
                    this.where(filtroWhere, 'LIKE', '%'+codigo_producto+'%')
                        .andWhere('c.fecha', '>=', fecha_ini)
                        .andWhere('c.fecha', '<=', fecha_fin)
                        .andWhere('d.prefijo', '=', prefijo)
                        .andWhere('d.empresa_id', '=', empresa_id);
                }else{
                    this.where('c.fecha', '>=', fecha_ini)
                        .andWhere('c.fecha', '<=', fecha_fin)
                        .andWhere('d.prefijo', '=', prefijo)
                        .andWhere('d.empresa_id', '=', empresa_id);
                }
            })
            .groupBy([
                'a.subclase_id',
                'c.documento_id',
                'c.producto_id',
                'c.producto_cantidad',
                'c.costo_anterior',
                'c.costo_asignado',
                'c.total_diferencia',
                'c.justificacion',
                'c.aprobacion',
                'c.fecha',
                'c.empresa_id',
                'c.ajuste_precio_id	',
                'c.url_documento',
                'c.usuario_id',
                'd.prefijo',
                'd.numeracion'
            ])
            .orderBy('c.fecha', 'DESC')
            .limit(magnitud_item)
            .offset(offset_num);
    }else {
        if (filtro == 'Codigo') {
            filtroWhere = 'c.codigo_producto';
        } else if (filtro == 'Descripcion') {
            filtroWhere = 'c.descripcion';
        }

        var campos = [
            'b.numeracion',
            'a.*',
            'b.prefijo',
            G.knex.raw('split_part(a.aprobacion, \' \', 1) as aprobacion1'),
            G.knex.raw('split_part(a.aprobacion, \' \', 2) as aprobacion2'),
            G.knex.raw('fc_descripcion_producto(a.producto_id) as descripcion')
        ];

        var query = G.knex.column(campos).select()
            .from("inv_bodegas_ajuste_precio as a")
            .innerJoin('documentos as b', 'a.documento_id', 'b.documento_id')
            .innerJoin('inventarios_productos as c', 'a.producto_id', 'c.codigo_producto')
            .innerJoin('inv_subclases_inventarios as d', 'c.subclase_id', 'd.subclase_id')
            .where(function () {
                if (codigo_producto != '') {
                    this.where(filtroWhere, 'LIKE', '%' + codigo_producto + '%')
                        .andWhere('a.fecha', '>=', fecha_ini)
                        .andWhere('a.fecha', '<=', fecha_fin)
                        .andWhere('b.prefijo', '=', prefijo)
                        .andWhere('b.empresa_id', '=', empresa_id);
                } else {
                    this.where('a.fecha', '>=', fecha_ini)
                        .andWhere('a.fecha', '<=', fecha_fin)
                        .andWhere('b.prefijo', '=', prefijo)
                        .andWhere('b.empresa_id', '=', empresa_id);
                }
            })
            .groupBy([
                'd.subclase_id',
                'a.documento_id',
                'a.producto_id',
                'a.producto_cantidad',
                'a.costo_anterior',
                'a.costo_asignado',
                'a.total_diferencia',
                'a.justificacion',
                'a.aprobacion',
                'a.fecha',
                'a.empresa_id',
                'a.ajuste_precio_id	',
                'a.url_documento',
                'a.usuario_id',
                'b.prefijo',
                'b.numeracion'
            ])
            .orderBy('a.fecha', 'DESC')
            .limit(magnitud_item)
            .offset(offset_num);
    }
    // console.log('Llegó este objeto: ',obj);
    // .orderBy('fecha_entrega', 'asc');
     console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};

PreciosProductosModel.prototype.listarAgrupar = function (obj, callback) {
    var codigoBuscar = obj.relacion_id;
    var empresa_id = obj.empresa_id;
    var magnitud_item = 20;
    var magnitud_item2 = 15;
    var filtro = obj.filtro;
    var filtroWhere = '';
    var offset_num = 0;

    if(obj.paginaActualAjustes > 0){
        offset_num = (obj.paginaActualAjustes-1)*magnitud_item;
    }

    if(filtro == 'Codigo'){
        filtroWhere = 'a.codigo_producto';
    }else if(filtro == 'Descripcion'){
        filtroWhere = 'b.descripcion';
    }else if(filtro == 'Molecula'){
        filtroWhere = 'c.descripcion';
    }

    if(codigoBuscar != undefined) {
        codigoBuscar = codigoBuscar.toUpperCase();
    }else{
        codigoBuscar = '';
    }
    var query = G.knex.column(
        'a.codigo_producto',
        'a.costo',
        'a.costo_ultima_compra',
        'a.existencia',
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion"))
        .select()
        .from("inventarios AS a")
        .innerJoin("inventarios_productos as b", "a.codigo_producto", "b.codigo_producto")
        .innerJoin('inv_subclases_inventarios as c', 'b.subclase_id', 'c.subclase_id')
        .where('a.empresa_id', '=', empresa_id)
        .andWhere(function() {
            //if(codigoBuscar != undefined && codigoBuscar != ''){
            this.where(filtroWhere, 'like', '%'+codigoBuscar+'%')
            //}
        })
        .groupBy([
            'a.codigo_producto',
            'a.costo',
            'a.costo_ultima_compra',
            'a.existencia'
        ])
        .orderBy('a.codigo_producto')
        .limit(magnitud_item)
        .offset(offset_num);
    // .orderBy('fecha_entrega', 'asc');
    //  console.log('SQL Listar_agrupar: ',G.sqlformatter.format(query.toString()));
    query.then(function (resultado) {
        // resultado.push(codigoBuscar);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
        /*
    }else{
        var resultado = [];
        for(var i = resultado.length; i<magnitud_item2; i++){
            resultado.push('');
        }
        callback(false, resultado);
    }
    */
};


PreciosProductosModel.prototype.listarProductos = function (obj, callback) {

    var query = G.knex.column(
        'a.codigo_producto',
        'b.descripcion',
        'a.costo',
        'a.costo_ultima_compra',
        'a.existencia')
        .select()
        .from("inventarios AS a")
        .innerJoin("inventarios_productos as b", "a.codigo_producto", "b.codigo_producto")
        .orderBy('a.codigo_producto').limit(15);
    // .orderBy('fecha_entrega', 'asc');
    //  console.log(G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        //resultado.push("Query ->"+query);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarAgrupar]:", err);
        callback(err);
    });
};


PreciosProductosModel.prototype.guardarConcepto = function (obj, callback) {

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

PreciosProductosModel.prototype.subirArchivo = function (obj, callback) {


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



PreciosProductosModel.prototype.factura = function (obj, callback) {

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

PreciosProductosModel.prototype.modificarFactura = function (obj, callback) {
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

PreciosProductosModel.prototype.modificarEntregado = function (obj, callback) {

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

PreciosProductosModel.prototype.modificarNombreArchivo = function (obj, callback) {

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
PreciosProductosModel.prototype.eliminarGrupoFactura = function (obj, callback) {
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

PreciosProductosModel.prototype.agruparFacturaSecuencia = function (callback) {
    var query = G.knex.column(G.knex.raw("nextval('agrupar_factura_agrupar_factura_id_seq') as secuencia"))
            ;
    query.then(function (resultado) {

        callback(false, resultado[0].secuencia);
    }).catch(function (err) {
        console.log("err [agruparFacturaSecuencia]:", err);
        callback(err);
    });

};

PreciosProductosModel.prototype.insertAgruparFactura = function (obj, callback) {

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

PreciosProductosModel.prototype.listarFacturaEntregado = function (callback) {
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

PreciosProductosModel.prototype.agregarFacturaEntregado = function (obj, callback) {
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

PreciosProductosModel.prototype.planillaRadicacion = function (obj, callback) {

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

PreciosProductosModel.prototype.modificarDescarga = function (obj, callback) {

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

PreciosProductosModel.prototype.listarItemReporte = function (obj, callback) {
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


PreciosProductosModel.prototype.listarMunicipio = function(termino_busqueda, pais_id, callback) {


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

PreciosProductosModel.$inject = [];

module.exports = PreciosProductosModel;