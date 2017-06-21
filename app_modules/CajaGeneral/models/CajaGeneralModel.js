var CajaGeneralModel = function() {
};


/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-05-31 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarCajaGeneral = function(obj, callback) {

    var columna_a = [
        "a.caja_id",
        "b.sw_todos_cu",
        "b.empresa_id",
        "b.centro_utilidad",
        "b.ip_address",
        G.knex.raw("b.descripcion as descripcion3"),
        "b.tipo_numeracion",
        G.knex.raw("d.razon_social as descripcion1"),
        G.knex.raw("e.descripcion as descripcion2"),
        "b.cuenta_tipo_id",
        "a.caja_id",
        "b.tipo_numeracion_devoluciones",
        G.knex.raw("NULL AS prefijo_fac_contado"),
        G.knex.raw("NULL AS prefijo_fac_credito"),
        G.knex.raw("NULL as concepto_caja")
    ];
    var columna_b = [
        "a.caja_id",
        G.knex.raw("NULL as sw_todos_cu"),
        "b.empresa_id",
        "f.centro_utilidad",
        "b.ip_address",
        G.knex.raw("b.descripcion as descripcion3"),
        G.knex.raw("NULL as tipo_numeracion"),
        G.knex.raw("d.razon_social as descripcion1"),
        G.knex.raw("e.descripcion AS descripcion2"),
        "b.cuenta_tipo_id",
        "a.caja_id",
        G.knex.raw("NULL as tipo_numeracion_devoluciones"),
        "b.prefijo_fac_contado",
        "b.prefijo_fac_credito",
        G.knex.raw("b.concepto as concepto_caja")
    ];

    var query = G.knex.select(columna_a)
            .from('cajas_usuarios as a')
            .innerJoin('cajas as b', function() {
        this.on("a.caja_id", "b.caja_id")
    })
            .innerJoin('documentos as c', function() {
        this.on("b.tipo_numeracion", "c.documento_id")
    })
            .innerJoin('empresas as d', function() {
        this.on("b.empresa_id", "d.empresa_id")
    })
            .innerJoin('centros_utilidad as e', function() {
        this.on("d.empresa_id", "e.empresa_id")
                .on("b.centro_utilidad", "e.centro_utilidad")
    })
            .where(function() {

    }).andWhere(' a.usuario_id', obj.usuario_id)
            .andWhere('d.empresa_id', obj.empresa_id)
            .andWhere('b.centro_utilidad', obj.centro_utilidad)
            .union(function() {
        this.select(columna_b)
                .from("userpermisos_cajas_rapidas as a")
                .innerJoin('cajas_rapidas as b', function() {
            this.on("a.caja_id", "b.caja_id")
        })
                .innerJoin('empresas as d', function() {
            this.on("b.empresa_id", "d.empresa_id")
        })
                .innerJoin('departamentos as f', function() {
            this.on("b.departamento", "f.departamento")
        })
                .innerJoin('centros_utilidad as e', function() {
            this.on("f.centro_utilidad", "e.centro_utilidad")
                    .on("f.empresa_id", "e.empresa_id")
        })
                .where(function() {
            this.andWhere(G.knex.raw("b.cuenta_tipo_id = '03'"))
            this.orWhere(G.knex.raw("b.cuenta_tipo_id='08'"))

        }).andWhere('a.usuario_id', obj.usuario_id)
                .andWhere('f.empresa_id', obj.empresa_id)
                .andWhere('f.centro_utilidad', obj.centro_utilidad)
    }).as("b");

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarCajaGeneral]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los grupos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarGrupos = function(obj, callback) {

    var columna = [
        G.knex.raw("DISTINCT a.grupo_concepto"),
        "a.descripcion",
        "b.grupo_concepto",
        "b.descripcion as descripcion_concepto",
        "b.precio",
        "b.porcentaje_gravamen",
        "b.sw_precio_manual",
        "b.sw_cantidad",
        "b.concepto_id"
    ];

    var query = G.knex.select(columna)
            .from('grupos_conceptos as a')
            .innerJoin('conceptos_caja_conceptos as b',
            function() {
                this.on("a.grupo_concepto", "b.grupo_concepto")
            }).where(function() {
        if (obj.contado) {
            this.andWhere(G.knex.raw("b.sw_contado='1'"))
        }
        if (obj.credito) {
            this.andWhere(G.knex.raw("b.sw_credito='1'"))
        }
        if (obj.conceptoId !== '') {
            this.andWhere('b.concepto_id', obj.conceptoId)
        }
        if (obj.grupoConcepto !== '') {
            this.andWhere('b.grupo_concepto', obj.grupoConcepto)
        }
    }).andWhere('a.empresa_id', obj.empresa_id)

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {
        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarGrupos]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los Conceptos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarConceptos = function(obj, callback) {

    var columna = [
        "b.grupo_concepto",
        "b.descripcion",
        "b.precio",
        "b.porcentaje_gravamen",
        "b.sw_precio_manual",
        "b.sw_cantidad",
        "b.concepto_id"
    ];

    var query = G.knex.select(columna)
            .from('grupos_conceptos as a')
            .innerJoin('conceptos_caja_conceptos as b',
            function() {
                this.on("a.grupo_concepto", "b.grupo_concepto")
            }).where(function() {
        if (obj.contado) {
            this.andWhere(G.knex.raw("b.sw_contado='1'"))
        }
        if (obj.credito) {
            this.andWhere(G.knex.raw("b.sw_credito='1'"))
        }
    }).andWhere('a.empresa_id', obj.empresa_id)

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarGrupos]:", err);
        callback(err);
    });
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los Conceptos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarConceptosDetalle = function(obj, callback) {

    var columna = [
        "a.concepto_id",
        "a.cantidad",
        "a.precio",
        "a.descripcion",
        "a.porcentaje_gravamen",
        "a.grupo_concepto",
        "c.descripcion as desconcepto",
        "b.descripcion as desgrupo",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.rc_concepto_id",
        "a.empresa_id",
        "a.centro_utilidad",
        "a.sw_tipo",
        "a.cantidad",
        "a.valor_total",
        "a.valor_gravamen",
        "a.tipo_pago_id"
    ];

    var query = G.knex.select(columna)
            .from('tmp_detalle_conceptos as a')
            .innerJoin('grupos_conceptos as  b ',
            function() {
                this.on("a.grupo_concepto", "b.grupo_concepto")
            })
            .innerJoin('conceptos_caja_conceptos as  c',
            function() {
                this.on("c.grupo_concepto", "b.grupo_concepto")
                        .on("a.concepto_id", "c.concepto_id")
            }).where(function() {
        this.andWhere("a.tipo_id_tercero", obj.tipoIdTercero)
                .andWhere("a.tercero_id", obj.terceroId)
                .andWhere("b.empresa_id", obj.empresaId)
                .andWhere("a.concepto_id", obj.conceptoId)
    });
 
    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {
	
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err [listarConceptosDetalle]:", err);
        callback(err);
    });
};

/**
 * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarTmpDetalleConceptos = function(parametros, callback) {

    var query = G.knex('tmp_detalle_conceptos').insert(parametros);

    query.then(function(resultado) {
       
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [insertarTmpDetalleConceptos]: ", err);
        callback({err: err, msj: "Error al guardar la factura agrupada]"});
    });
};

/*
 * Autor : Andres Mauricio Gonzalez
 * Descripcion : SQL encargado de eliminar los conceptos tmp_detalle_conceptos
 * @fecha: 08/06/2015 2:43 pm
 */
CajaGeneralModel.prototype.eliminarTmpDetalleConceptos = function(obj, callback) {

    var query = G.knex('tmp_detalle_conceptos')
            .where('rc_concepto_id', obj.rc_concepto_id)
            .del();

    query.then(function(resultado) {
        console.log("query::: ", query.toString());
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [eliminarTmpDetalleConceptos]: ", err);
        callback({err: err, msj: "Error al eliminar los temporales"});
    });
};

/**
 *
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.bloquearTablaDocumentos = function(transaccion, callback) {

    var sql = "LOCK TABLE documentos IN ROW EXCLUSIVE MODE ;";

    var query = G.knex.raw(sql);

    if (transaccion)
        query.transacting(transaccion);
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [bloquearTabla documentos]: ", err);
        callback(err);
    });

};

/**
 *
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.actualizarTipoFormula = function(obj,transaccion, callback) {

    var query = G.knex('documentos')
            .where('documento_id', obj.documentoId)
            .returning(['numeracion','prefijo'])
            .increment('numeracion', 1);
    
   if (transaccion)
        query.transacting(transaccion);    
    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [actualizarTipoFormula]: ", err);
        callback("Error al actualizar el tipo de formula");
    });
};


/**
 * +Descripcion Metodo encargado de registrar en la tabla fac_facturas
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarFacFacturas = function(parametros,transaccion, callback) {
    
    var parametro={
	empresa_id : parametros.empresaId, 
	prefijo :  parametros.prefijo, 
	factura_fiscal : parametros.factura, 
	estado : parametros.estado, 
	usuario_id : parametros.usuarioId, 
	fecha_registro : 'now()', 
	tipo_id_tercero : parametros.tipoIdTercero, 
	tercero_id : parametros.terceroId, 
	sw_clase_factura : parametros.swClaseFactura,
	documento_id : parametros.documentoId, 
	tipo_factura : parametros.tipoFactura, 
	centro_utilidad : parametros.centroUtilidad
    };
        
    var query = G.knex('fac_facturas').insert(parametro);

   if (transaccion)
        query.transacting(transaccion); 
    query.then(function(resultado) {
        
        callback(false, resultado);
	
    }). catch (function(err) {
        console.log("err (/catch) [insertarFacFacturas]: ", err);
        callback({err: err, msj: "Error al guardar en insertarFacFacturas]"});
    });
};

/**
 * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarFacFacturasConceptos = function(parametro,transaccion,callback) {

    var parametros = {
		    empresa_id : parametro.empresaId,
		    prefijo : parametro.prefijo,
		    factura_fiscal : parametro.facturaFiscal,
		    sw_tipo : parametro.swTipo,
		    cantidad : parametro.cantidad,
		    precio : parametro.precio,
		    valor_total : parametro.valorTotal,
		    porcentaje_gravamen : parametro.porcentajeGravamen,
		    valor_gravamen : parametro.valorGravamen,
		    concepto : parametro.descripcion,
		    caja_id :  parametro.cajaId
    };

    var query = G.knex('fac_facturas_conceptos')
	        .insert(parametros)
	        .returning(['fac_factura_concepto_id']);
     if (transaccion)
        query.transacting(transaccion); 
    
    query.then(function(resultado) {
       
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [insertarFacFacturasConceptos]: ", err);
        callback({err: err, msj: "Error al guardar la factura conceptos]"});
    });
};

/**
 * +Descripcion Metodo encargado de registrar la direccion ip en el 
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarPcFactura = function(parametro,transaccion, callback){
   
    var parametros = {ip: parametro.direccionIp,
            prefijo: parametro.prefijo,
            factura_fiscal: parametro.factura,
            sw_tipo_factura : parametro.swTipoFactura,
            fecha_registro: G.knex.raw('now()'),
            empresa_id: parametro.empresaId
            };
        
    var query = G.knex('pc_factura_clientes').insert(parametros);
    
    if(transaccion)
        query.transacting(transaccion);     
        query.then(function(resultado){   
            console.log("resultado [insertarPcFactura]", resultado);
            callback(false, resultado);
        }).catch(function(err){
            console.log("err (/catch) [insertarPcFactura]: ", err);     
            callback({err:err, msj: "Error al guardar la factura agrupada]"});   
        });
};

/**
 * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarFacFacturasConceptosDc = function(parametro,transaccion,callback) {

    var parametros = {
		    empresa_id : parametro.empresaId,
		    fac_factura_concepto_id: parametro.id,	    
		    concepto_id : parametro.concepto,
		    grupo_concepto :  parametro.grupoConceptoId
    };

    var query = G.knex('fac_facturas_conceptos_dc')
	        .insert(parametros);
     if (transaccion)
        query.transacting(transaccion); 
    
    query.then(function(resultado) {
       
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [insertarFacFacturasConceptosDc]: ", err);
        callback({err: err, msj: "Error al guardar la factura conceptos dc]"});
    });
};
/**
 * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.insertarFacturasContado = function(parametro,transaccion,callback) {

    var parametros = {
		    empresa_id : parametro.empresaId,
		    factura_fiscal: parametro.factura,	    
		    centro_utilidad : parametro.centroUtilidad,
		    prefijo : parametro.prefijo,
		    total_abono : parametro.totalAbono,
		    total_efectivo : parametro.totalEfectivo,
		    total_cheques : parametro.totalCheque,
		    total_tarjetas : parametro.totalTarjeta,
		    total_bonos : parametro.totalAbonos,
		    estado : '0',
		    tipo_id_tercero : parametro.tipoIdTercero,
		    tercero_id : parametro.terceroId,
		    fecha_registro : G.knex.raw('now()'),
		    usuario_id : parametro.usuarioId,
		    caja_id : parametro.cajaId
    };
   
    var query = G.knex('fac_facturas_contado')
	        .insert(parametros);
     if (transaccion)
        query.transacting(transaccion); 
    
    query.then(function(resultado) {
       
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [insertarFacturasContado]: ", err);
        callback({err: err, msj: "Error al guardar Facturas Contado]"});
    });
};

/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.actualizarTotalesFacturas= function(obj,transaccion, callback) {
 console.log("obj",obj);
    var query = G.knex('fac_facturas')
		.where('empresa_id', obj.empresaId)
		.andWhere('prefijo', obj.prefijo)
		.andWhere('factura_fiscal', obj.factura)
		.update({
		    total_factura:obj.totalFactura,
		    gravamen:obj.totalGravamen
		});
//console.log("actualizarTotalesFacturas::::::::::::::::: ",query.toSQL());		
       if (transaccion)
        query.transacting(transaccion); 
    query.then(function(resultado){ 
       callback(false, resultado);
    }).catch(function(err){    
       console.log("err (/catch) [actualizarTotalesFacturas]: ", err);
       callback("Error al actualizar fac_facturas");  
    });
};

/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.actualizarImpuestoFacturas= function(obj,transaccion, callback) {
 //console.log("obj",obj);
    var query = G.knex('fac_facturas')
		.where('empresa_id', obj.empresaId)
		.andWhere('prefijo', obj.prefijo)
		.andWhere('factura_fiscal', obj.factura)
		.update({
		    porcentaje_rtf:obj.porcentajeRtf,
		    porcentaje_ica:obj.porcentajeIca,
		    porcentaje_reteiva:obj.porcentajeReteiva,
		    porcentaje_cree:obj.porcentajeCree
		});
		
       if (transaccion)
        query.transacting(transaccion); 
    query.then(function(resultado){ 
       callback(false, resultado);
    }).catch(function(err){    
       console.log("err (/catch) [actualizarImpuestoFacturas]: ", err);
       callback("Error al actualizar fac_facturas");  
    });
};


/*
 * Autor : Andres Mauricio Gonzalez
 * Descripcion : SQL encargado de eliminar los conceptos tmp_detalle_conceptos
 * @fecha: 08/06/2015 2:43 pm
 */
CajaGeneralModel.prototype.eliminarTmpDetalleConceptosTerceros = function(obj,transaccion, callback) {

    var query = G.knex('tmp_detalle_conceptos')
            .where('tipo_id_tercero', obj.tipoIdTercero)
            .where('tercero_id', obj.terceroId)
            .where('empresa_id', obj.empresaId)
            .del();
    
     if (transaccion)
        query.transacting(transaccion); 
    query.then(function(resultado) {
      //  console.log("query::: ", query.toString());
        callback(false, resultado);
    }). catch (function(err) {
        console.log("err (/catch) [eliminarTmpDetalleConceptosTerceros]: ", err);
        callback({err: err, msj: "Error al eliminar los temporales por terceros"});
    });
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de listar los Conceptos
 * @fecha 2017-06-02 YYYY-MM-DD
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
CajaGeneralModel.prototype.listarEmpresa = function(obj, callback) {

    var columna = [
        "a.id",
        "a.razon_social",
        "a.direccion",
        "a.telefonos",
        "a.tipo_id_tercero",
        "b.departamento	",
        "c.municipio"
    ];

    var query = G.knex.select(columna)
            .from('empresas as a')
            .innerJoin('tipo_dptos as b',
            function() {
                this.on("b.tipo_pais_id", "a.tipo_pais_id")
                    .on("b.tipo_dpto_id", "a.tipo_dpto_id")
            })
            .innerJoin('tipo_mpios as c',
            function() {
                this.on("c.tipo_pais_id", "a.tipo_pais_id")
                    .on("c.tipo_dpto_id", "a.tipo_dpto_id")
                    .on("c.tipo_mpio_id", "a.tipo_mpio_id")
            }).where("empresa_id", obj.empresaId);

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function(resultado) {

        callback(false, resultado)
    }). catch (function(err) {
        console.log("err [listarGrupos]:", err);
        callback(err);
    });
};

CajaGeneralModel.$inject = [];


module.exports = CajaGeneralModel;