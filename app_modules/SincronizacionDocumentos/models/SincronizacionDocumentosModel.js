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

SincronizacionDocumentosModel.prototype.guardarCuentas = function(obj, callback) {
    console.log('entro en el modelo de "guardarCuentas"!');    
    
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
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
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