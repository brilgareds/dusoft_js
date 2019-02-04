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
      console.log(G.sqlformatter.format(query.toString()));
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarTiposCuentas = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentas"!');
    
    var query = G.knex.select('tipos_cu.cuenta_id', 'tipos_cate.categoria_descripcion')
            .from('tipos_cuentas as tipos_cu')
            .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')            
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarTipoCuentaCategoria = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentasCategorias"!');
    
    var query = G.knex.select('categoria_id', 'categoria_descripcion')
            .from('tipos_cuentas')             
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarDocumentosCuentas = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentas"!');
    
    var query = G.knex.select(
            'doc_cu.prefijo', 
            'doc_cu.empresa_id',
            'doc_cu.centro_id',
            'doc_cu.bodega_id',
            'doc_cu.cuenta_debito')
            .from('documentos_cuentas as doc_cu')
            .innerJoin('tipos_cuentas as tipos_cu', 'doc_cu.cuenta_debito', 'tipos_cu.cuenta_id')            
            .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')        
            .innerJoin('tipos_cuentas as tipos_cu', 'doc_cu.cuenta_credito', 'tipos_cu.cuenta_id')            
            .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')
    
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


SincronizacionDocumentosModel.prototype.insertTiposCuentas = function(obj, callback) {
    console.log('entro en el modelo de "tipos_cuentas"!');
    
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



module.exports = SincronizacionDocumentosModel;