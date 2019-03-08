var SincronizacionDocumentosModel = function() {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function(obj, callback) {
       
    var query = G.knex.select(['a.prefijo', 'a.tipo_doc_general_id', 'a.texto1'])
            .from('documentos as a')
            .where(function(){
            }).andWhere('empresa_id', obj.empresaId)
              .orderBy('tipo_doc_general_id');
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarTiposFacturas = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposFacturas"!');    
    var query = G.knex.select(['parametrizacion_ws_fi_id as id', 'nombre as descripcion']).from('parametrizacion_ws_fi');    
    //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.guardarCuentas = function(array, callback) {
    console.log('entro en el modelo de "guardarCuentas"!');   
    
    for(var obj in array){
        
        //console.log('item es: ', item,' y el index es: ',index);
        var query = G.knex('documentos_cuentas')
        .insert({
            prefijo: obj.prefijo,
            emrpesa_id: obj.emrpesa_id,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega_id,
            cuenta_debito: obj.cuenta_debito,
            cuenta_credito: obj.cuenta_credito,
            centro_costos_asientos: obj.centro_costos_asientos,
            centro_utiliad_asiento: obj.centro_utiliad_asiento,
            cod_linea_costo_asiento: obj.cod_linea_costo_asiento,
            id_tercero_asiento: obj.id_tercero_asiento,
            observacion_asiento: obj.observacion_asiento
        });
        //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));

        query.then(function(resultado) {

        }).catch (function(err) {
            console.log("error sql",err);
            callback(err);
         });                
    };     
    return true;
};

SincronizacionDocumentosModel.prototype.listarTipoCuentaCategoria = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentasCategorias"!');
    
    var query = G.knex.select(['categoria_id', 'categoria_descripcion'])
                .from('tipos_cuentas_categorias');           
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarTiposCuentas = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentas"!');
    
    var query = G.knex.select('tipos_cu.cuenta_id', 'tipos_cate.categoria_descripcion', 'tipos_cate.categoria_id')
            .from('tipos_cuentas as tipos_cu')
            .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')            
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.obtenerPrefijoFi = function(obj, callback) {
    console.log('entro en el modelo de "obtener_prefijo_fi"!');

    var query = G.knex.select(G.knex.raw("COALESCE(b.prefijo ,'') as prefijo_fi"))
                .from('documentos as a')
                .innerJoin('prefijos_financiero as b', 'a.prefijos_financiero_id', 'b.id') 
                .where(function(){
                }).andWhere('a.prefijo', obj.prefijo)
                  .andWhere('a.empresa_id', obj.empresaId);
    console.log(G.sqlformatter.format(query.toString())); 
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.parametrizacionCabeceraFi = function(obj, callback) {
    console.log('entro en el modelo de "obtener_prefijo_fi"!');

    var query = G.knex.select(
                        [
                        'parametrizacion_ws_fi_id',
                        'nombre', 
                        'estadoencabezado', 
                        'tipotercero', 
                        'plazotercero', 
                        'numeroradicacion', 
                        'codempresa',
                        'coddocumentoencabezado',
                        'observacionencabezado'
                        ]
                    ).from('parametrizacion_ws_fi as a')
                     .andWhere('a.parametrizacion_ws_fi_id', obj.parametrizacion);
    console.log(G.sqlformatter.format(query.toString())); 
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarCuentasDetalle = function(obj, callback) {
    console.log('entro en el modelo de "listarCuentasDetalle"!');
    
    var query = G.knex.select([
            'documentos_cuentas_id',
            'prefijo',
            'empresa_id',
            'centro_id',
            'bodega_id',
            'cuenta',
            'sw_cuenta',
            'centro_costos_asientos',
            'centro_utilidad_asiento',
            'cod_linea_costo_asiento',
            'id_tercero_asiento',
            'observacion_asiento',
            'categoria_id',
            'categoria_descripcion',
            'parametrizacion_ws_fi',
            'ica_porcentaje',
            'cree_porcentaje',
            'rtf_porcentaje'
            ])
        .from('documentos_cuentas as doc_cu')            
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'doc_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .where(function () {
                this.andWhere('prefijo', obj.prefijo)
                    .andWhere('empresa_id', obj.empresaId)
                    .andWhere('bodega_id', obj.bodega)
                    .andWhere('parametrizacion_ws_fi', obj.wsFi);
            }).orderBy("cuenta_categoria","asc");

        console.log("listarCuentasDetalle",G.sqlformatter.format(query.toString())); 
//console.log(G.sqlformatter.format(query.toString())); 
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarDocumentosCuentas = function(obj, callback) {
    console.log('entro en el modelo de "listarDocumentosCuentas"!');
    
    var query = G.knex.select([
            'doc_cu.prefijo', 
            'doc_cu.empresa_id',
            'doc_cu.centro_id',
            'doc_cu.bodega_id',
            'doc_cu.cuenta_debito as cuenta_debito_num',
            'tipos_cate.categoria_descripcion as cuenta_debito_des',
            'doc_cu.cuenta_credito as cuenta_credito_num',
            'tipos_cate2.categoria_descripcion as cuenta_credito_des'])
        .from('documentos_cuentas as doc_cu')
        .innerJoin('tipos_cuentas as tipos_cu', 'doc_cu.cuenta_debito', 'tipos_cu.cuenta_id')            
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')        
        .innerJoin('tipos_cuentas as tipos_cu2', 'doc_cu.cuenta_credito', 'tipos_cu2.cuenta_id')            
        .innerJoin('tipos_cuentas_categorias as tipos_cate2', 'tipos_cu2.cuenta_categoria', 'tipos_cate2.categoria_id');


    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.insertTiposCuentas = function(obj, callback) {
    console.log('entro en el modelo de "tipos_cuentas"!',obj);
    
    var query = G.knex('tipos_cuentas')
        .insert({
            cuenta_id: obj.cuentaId,
            cuenta_categoria: obj.cuentaCategoria
        });
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.insertDocumentosCuentas = function(obj, callback) {
    console.log('entro en el modelo de "documentos_cuentas"!');
    
    var query = G.knex('documentos_cuentas')
        .insert({
            prefijo: obj.prefijo,
            empresa_id: obj.empresaId,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega,
            cuenta_debito: obj.cuentaDebito,
            cuenta_credito: obj.cuentaCredito
        });
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.insertTiposCuentasCategorias = function(obj, callback) {
    console.log('entro en el modelo de "tipos_cuentas_categorias"!');
    
    var query = G.knex('tipos_cuentas_categorias')
        .insert({
            categoria_id: obj.categoriaId,
            categoria_descripcion: obj.categoriaDescripcion
        });
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.sincronizarFinaciero=function(obj, callback) {
console.log("*********sincronizarFinaciero*************");
//    var url = G.constants.WS().FI.DUSOFT_FI;
    var url = obj.url;
    obj.error = false;

    G.Q.nfcall(G.soap.createClient, url).then(function(client) {
         
        return G.Q.ninvoke(client, obj.funcion, obj.parametros);

    }).spread(function(result, raw, soapHeader) {
        obj.obj=result.crearInformacionContableResult;
console.log("result crearInformacionContableResult---",result);
console.log("result crearInformacionContableResult---",result.crearInformacionContableResult.descripcion);
//console.log("result.return---",result.return);
//console.log("raw---",raw);
//console.log("soapHeader---",soapHeader);
//        if (!result.return.msj["$value"]) {
//            throw {msj: "Se ha generado un error", status: 403, obj: {}};
//        } else {
//            obj.resultado = JSON.parse(result.return.msj["$value"]);
//        }

    }).then(function() {
        callback(false, obj.obj);

    }).fail(function(err) {
        console.log("Error sincronizarFinaciero ", err);
        obj.error = true;
        obj.tipo = '0';
        callback(err);

    }).done();
};


SincronizacionDocumentosModel.$inject = [];

module.exports = SincronizacionDocumentosModel;