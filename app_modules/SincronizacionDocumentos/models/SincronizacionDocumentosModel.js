var SincronizacionDocumentosModel = function() {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function(obj, callback) {
    console.log('entro en el modelo!',obj);
    var data = {prefijos: '', prefijosFiltrados: ''};

    var query = G.knex
        .distinct('a.prefijo', 'a.tipo_doc_general_id', 'a.texto1')
        .select()
        .from('documentos as a')
        .where('a.empresa_id', obj.empresaId)
        .orderBy('a.prefijo');
    query.then(function(resultado) {
        data.prefijos = resultado;
        var query = G.knex
            .distinct('a.prefijo', 'a.tipo_doc_general_id', 'a.texto1')
            .select()
            .from('documentos as a')
            .innerJoin('documentos_cuentas as b', 'a.prefijo', 'b.prefijo')
            .where('a.empresa_id', obj.empresaId)
            .orderBy('a.prefijo');
        query.then(function (resultado) {
            data.prefijosFiltrados = resultado;
            callback(false, data);
        }).catch(function (err) {
            console.log("error sql", err);
            callback(err);
        })
    }).catch(function(err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarTiposServicios = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposServicios"!');
    console.log('Objeto en modelo: ', obj);
    var data = {servicios: '', serviciosFiltrados: ''};

    var query = G.knex.distinct([
        'para_ws.parametrizacion_ws_fi_id as id',
        'para_ws.nombre as descripcion'])
        .select()
        .from('parametrizacion_ws_fi as para_ws');
    //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));
    
    query.then(function(resultado) {
        data.servicios = resultado;
        if(obj.prefijo !== undefined){
            var prefijo = obj.prefijo;
            var query = G.knex.distinct([
                'para_ws.parametrizacion_ws_fi_id as id',
                'para_ws.nombre as descripcion'])
                .select()
                .from('parametrizacion_ws_fi as para_ws')
                .innerJoin('documentos_cuentas as doc_cu', 'para_ws.parametrizacion_ws_fi_id', 'doc_cu.parametrizacion_ws_fi')
                .where('doc_cu.prefijo', prefijo);
            //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));
            query.then(function(resultado) {
                data.serviciosFiltrados = resultado;
                callback(false, data);
            }).catch (function(err) {
                console.log("error sql",err);
                callback(err);
            });
        }else{
            data.serviciosFiltrados = [];
            callback(false, data);
        }
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.guardarCuentas = function(obj, callback) {
    console.log('entro en el modelo de "guardarCuentas"!');

    var query = G.knex.select('documentos_cuentas_id')
        .from('documentos_cuentas')
        .where({
            prefijo: obj.prefijo_id,
            empresa_id: obj.empresa_id,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega_id,
            cuenta: obj.cuenta_id,
            sw_cuenta: obj.sw_cuenta,
            parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
            cuenta_categoria: obj.categoria_id
        });
    //console.log('Query: ', G.sqlformatter.format(query.toString()));

    query.then(function(resultado) {
        //console.log('Resultado de consulta es: ', resultado);
        if(resultado.length === 0){
            //console.log('Dentro del IF!!!!');
            var insert = G.knex('documentos_cuentas')
                .insert({
                    prefijo: obj.prefijo_id,
                    empresa_id: obj.empresa_id,
                    centro_id: obj.centro_id,
                    bodega_id: obj.bodega_id,
                    cuenta: obj.cuenta_id,
                    sw_cuenta: obj.sw_cuenta,
                    centro_costos_asientos: obj.centro_costos_asientos,
                    centro_utilidad_asiento: obj.centro_utilidad_asiento,
                    cod_linea_costo_asiento: obj.cod_linea_costo_asiento,
                    id_tercero_asiento: obj.id_tercero_asiento,
                    observacion_asiento: obj.observacion_asiento,
                    parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
                    cuenta_categoria: obj.categoria_id
                });
            console.log('Insert: ', G.sqlformatter.format(insert.toString()));

            insert.then(function(resultado) {
                callback(false, true);
            }).catch (function(err) {
                console.log("error sql",err);
                callback(err);
            });
        }else{
            //console.log('Dentro del ELSE!!!!');
            var update = G.knex('documentos_cuentas')
                .where({
                    prefijo: obj.prefijo_id,
                    empresa_id: obj.empresa_id,
                    centro_id: obj.centro_id,
                    bodega_id: obj.bodega_id,
                    cuenta: obj.cuenta_id,
                    sw_cuenta: obj.sw_cuenta,
                    parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
                    cuenta_categoria: obj.categoria_id
                })
                .update({
                    centro_costos_asientos: obj.centro_costos_asientos,
                    centro_utilidad_asiento: obj.centro_utilidad_asiento,
                    cod_linea_costo_asiento: obj.cod_linea_costo_asiento,
                    id_tercero_asiento: obj.id_tercero_asiento,
                    observacion_asiento: obj.observacion_asiento
                });
            console.log('Update: ', G.sqlformatter.format(update.toString()));
            update.then(function(resultado) {
                callback(false, true);
            }).catch (function(err) {
                console.log("error sql",err);
                callback(err);
            });
        }
    }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarTipoCuentaCategoria = function(obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentasCategorias"!');
    
    var query = G.knex.select(['categoria_id as id', 'categoria_descripcion as descripcion'])
                .from('tipos_cuentas_categorias');           
    
    query.then(function(resultado) {
       callback(false, resultado);
     }).catch (function(err) {
        console.log("error sql",err);
        callback(err);
     });
};

SincronizacionDocumentosModel.prototype.listarTiposCuentas = function(obj, callback) {
    //console.log('entro en el modelo de "listarTiposCuentas"!');
    
    var query = G.knex.select(
            'doc_cu.prefijo as prefijo_id',
            'doc_cu.empresa_id',
            'doc_cu.centro_id',
            'doc_cu.bodega_id',
            'doc_cu.cuenta',
            'doc_cu.sw_cuenta',
            'doc_cu.centro_costos_asientos',
            'doc_cu.centro_utilidad_asiento',
            'doc_cu.cod_linea_costo_asiento',
            'doc_cu.id_tercero_asiento',
            'doc_cu.observacion_asiento',
            'doc_cu.parametrizacion_ws_fi',
            'tipos_cate.categoria_descripcion',
            'tipos_cate.categoria_id')
        .from('documentos_cuentas as doc_cu')
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'doc_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .where('doc_cu.empresa_id', '=', obj.empresa_id)
        .andWhere('doc_cu.centro_id', obj.centro_id)
        .andWhere('doc_cu.bodega_id', obj.bodega_id)
        .andWhere('doc_cu.prefijo', obj.prefijo_id)
        .andWhere('doc_cu.parametrizacion_ws_fi', obj.servicio)
        .orderBy('tipos_cate.categoria_descripcion');

    //console.log(G.sqlformatter.format(query.toString()));

    query.then(function(resultado) {
        //console.log('Cuentas desde modelo: ', resultado);
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
            'cree_porcentaje'
            ])
        .from('documentos_cuentas as doc_cu')            
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'doc_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .where(function () {
                this.andWhere('prefijo', obj.prefijo)
                    .andWhere('empresa_id', obj.empresaId)
                    .andWhere('bodega_id', obj.bodega)
                    .andWhere('parametrizacion_ws_fi', obj.wsFi);
            }).orderBy("cuenta_categoria","asc");

//        console.log("listarCuentasDetalle",G.sqlformatter.format(query.toString())); 
console.log(G.sqlformatter.format(query.toString())); 
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
    console.log('entro en el modelo de "insertTiposCuentas"!',obj);
    var observacion_asiento = 'No Aplica Observacion Asiento - '+obj.cuentaCategoriaDescripcion;

    var select = G.knex('documentos_cuentas')
        .select('documentos_cuentas_id')
        .where({
            prefijo: obj.prefijoId,
            empresa_id: obj.empresaId,
            centro_id: obj.centroId,
            bodega_id: obj.bodegaId,
            cuenta: obj.cuentaId,
            sw_cuenta: obj.cuentaTipo,
            parametrizacion_ws_fi: obj.cuentaServicio
        });
    console.log('Select en insertTiposCuentas ',G.sqlformatter.format(select.toString()));

    select.then(function(resultado) {
        console.log('Resultado en modelo es: ', resultado);
        if(resultado === undefined || resultado[0] === undefined){
            //console.log('Entro en el if!!!');
            var query = G.knex('documentos_cuentas')
                .insert({
                    prefijo: obj.prefijoId,
                    empresa_id: obj.empresaId,
                    centro_id: obj.centroId,
                    bodega_id: obj.bodegaId,
                    cuenta: obj.cuentaId,
                    sw_cuenta: obj.cuentaTipo,
                    observacion_asiento: observacion_asiento,
                    parametrizacion_ws_fi: obj.cuentaServicio,
                    cuenta_categoria: obj.cuentaCategoriaId
                });
            query.then(function (resultado) {
                console.log('Insert fine!!!');
                callback(false, resultado);
            }).catch(function (err) {
                console.log("error sql", err);
                callback(err);
            });
        }else{
            console.log('Entro en el else!!!');
            var response = ['repetido'];
            callback(false, response);
        }
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
        console.log("Error __sincronizarCuentasXpagarFi ", err);
        obj.error = true;
        obj.tipo = '0';
        callback(err);

    }).done();
};

SincronizacionDocumentosModel.$inject = [];

module.exports = SincronizacionDocumentosModel;