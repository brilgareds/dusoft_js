var SincronizacionDocumentosModel = function() {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function(obj, callback) {
    console.log('entro en el modelo!',obj);
    console.log('entro en el modelo!',obj.empresaId);
    
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
    var categorias = array.categorias;
    var sw_cuentas = [0, 1];
    var tipo_cuenta = '';
    //console.log('Array in model is: ', categorias);

    for(var index in categorias){
        var obj = categorias[index];
        //console.log('For in Model: ', obj);
        sw_cuentas.forEach(function(sw_cuenta){
            if(sw_cuenta == 0){
                tipo_cuenta = 'debito';
            }else if(sw_cuenta == 1){
                tipo_cuenta = 'credito';
            }

            var query = G.knex.select('documentos_cuentas_id')
                .from('documentos_cuentas')
                .where({cuenta: obj.debito.cuenta_id, sw_cuenta: sw_cuenta});
            console.log('Query: ', G.sqlformatter.format(query.toString()));
            query.then(function(resultado) {
                //console.log('Resultado es: ', resultado);
                if(resultado[0] === undefined || resultado[0].documentos_cuentas_id === undefined){
                    var insert = G.knex('documentos_cuentas')
                    .insert({
                            prefijo: array.prefijo_id,
                            empresa_id: array.empresa_id,
                            centro_id: array.centro_id,
                            bodega_id: array.bodega_id,
                            cuenta: obj[tipo_cuenta].cuenta_id,
                            sw_cuenta: sw_cuenta,
                            centro_costos_asientos: obj[tipo_cuenta].centro_costos_asientos,
                            centro_utilidad_asiento: obj[tipo_cuenta].centro_utilidad_asiento,
                            cod_linea_costo_asiento: obj[tipo_cuenta].cod_linea_costo_asiento,
                            id_tercero_asiento: obj[tipo_cuenta].id_tercero_asiento,
                            observacion_asiento: obj[tipo_cuenta].observacion_asiento
                    });
                    console.log('Insert: ', G.sqlformatter.format(insert.toString()));

                    insert.then(function(resultado) {

                    }).catch (function(err) {
                        console.log("error sql",err);
                        callback(err);
                    });
                }else{
                    var update = G.knex('documentos_cuentas')
                        .where({cuenta: obj.debito.cuenta_id, sw_cuenta: sw_cuenta})
                        .update({
                            prefijo: array.prefijo_id,
                            empresa_id: array.empresa_id,
                            centro_id: array.centro_id,
                            bodega_id: array.bodega_id,
                            centro_costos_asientos: obj[tipo_cuenta].centro_costos_asientos,
                            centro_utilidad_asiento: obj[tipo_cuenta].centro_utilidad_asiento,
                            cod_linea_costo_asiento: obj[tipo_cuenta].cod_linea_costo_asiento,
                            id_tercero_asiento: obj[tipo_cuenta].id_tercero_asiento,
                            observacion_asiento: obj[tipo_cuenta].observacion_asiento
                        });
                    console.log('Update: ', G.sqlformatter.format(update.toString()));
                    update.then(function(resultado) {

                    }).catch (function(err) {
                        console.log("error sql",err);
                        callback(err);
                    });
                }
            }).catch (function(err) {
                console.log("error sql",err);
                callback(err);
            })
        });
    };
    callback(false, true);
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
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id');
    
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

        console.log(G.sqlformatter.format(query.toString())); 

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
    console.log(G.sqlformatter.format(query.toString()));
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


SincronizacionDocumentosModel.$inject = [];

module.exports = SincronizacionDocumentosModel;