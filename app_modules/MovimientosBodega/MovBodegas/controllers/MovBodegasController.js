
var MovBodegasController = function(movimientos_bodegas,m_ordenes_compra,m_I002) {

    this.m_movimientos_bodegas = movimientos_bodegas;
    this.m_ordenes_compra = m_ordenes_compra;
    this.m_I002 = m_I002;
};

// Consultar Documentos Usuario
MovBodegasController.prototype.consultarDocumentosUsuario = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.centro_utilidad_id === undefined || args.movimientos_bodegas.bodega_id === undefined || args.movimientos_bodegas.tipo_documento === undefined) {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.centro_utilidad_id === '' || args.movimientos_bodegas.bodega_id === '') {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }

    var usuario_id = req.session.user.usuario_id;
    var centro_utilidad_id = args.movimientos_bodegas.centro_utilidad_id;
    var bodega_id = args.movimientos_bodegas.bodega_id;
    var tipo_documento = args.movimientos_bodegas.tipo_documento;

    that.m_movimientos_bodegas.consultar_documentos_usuario(usuario_id, centro_utilidad_id, bodega_id, tipo_documento, function(err, lista_documentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los documentos del usuario', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista documentos del usuario', 200, {movimientos_bodegas: lista_documentos}));
        }
    });

};

// Actualizar bodegas_doc_id en documento temporal.
MovBodegasController.prototype.actualizarTipoDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.documento_temporal_id === undefined || args.movimientos_bodegas.usuario_id === undefined || args.movimientos_bodegas.bodegas_doc_id === undefined) {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.documento_temporal_id === '' || args.movimientos_bodegas.usuario_id === '' || args.movimientos_bodegas.bodegas_doc_id === '') {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id estan vacíos', 404, {}));
        return;
    }
    
    var documento_temporal_id = args.movimientos_bodegas.documento_temporal_id;
    var usuario_id = args.movimientos_bodegas.usuario_id;
    var bodegas_doc_id = args.movimientos_bodegas.bodegas_doc_id;

    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, usuario_id, bodegas_doc_id, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
        }
    });

};

MovBodegasController.prototype.eliminar_producto_movimiento_bodega_temporal= function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if (args.item_id === undefined) {
        res.send(G.utils.r(req.url, 'El item_id NO estan definido', 404, {}));
        return;
    }
    
    parametros={item_id:args.item_id};
    
    G.Q.ninvoke(that.m_movimientos_bodegas, "eliminar_producto_movimiento_bodega_temporal", parametros).then(function(result) {      
      return G.Q.ninvoke(that.m_movimientos_bodegas, "eliminar_compras_ordenes_pedidos_productosfoc", parametros);            
    }).then(function(result) {    
        res.send(G.utils.r(req.url, 'Producto Borrado Correctamente', 200, {eliminar_producto_movimiento_bodega_temporal: result}));
    }).fail(function(err) {
        console.log("eliminar_producto_movimiento_bodega_temporal ",err);
        res.send(G.utils.r(req.url, 'Error al borrar Producto', 500, {}));
    }).done();

};

/**
    * Metodo para adicionar un registro temporal.
    * @author Andres Mauricio Gonzalez Tascon
    * @param integer doc_tmp_id identificador del documento temporal
    * @param string codigo_producto identificador del producto
    * @param numeric cantidad cantidad
    * @param numeric porcentaje_gravamen porcentaje de gravamen
    * @param numeric total_costo total costo (cantidad * precio unitario gravado)
    * @param integer usuario_id (opcional) identificador del documento temporal
    * @return integer numero de item_id del documento creado.
    * @access public
    */
MovBodegasController.prototype.addItemDocTemporal=function(req,res){
   var that = this;
   var args = req.body.data;

    if (args.movimientos_bodegas.doc_tmp_id === '' || args.movimientos_bodegas.usuario_id === '' || args.movimientos_bodegas.bodegas_doc_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.codigo_producto === '') {
        res.send(G.utils.r(req.url, 'El codigo_producto esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.porcentaje_gravamen === '') {
        res.send(G.utils.r(req.url, 'El porcentaje_gravamen esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.total_costo < 0) {
        res.send(G.utils.r(req.url, 'El movimientos_bodegas es menor a cero', 404, {}));
        return;
    }else if(args.movimientos_bodegas.total_costo === ''){
       args.movimientos_bodegas.total_costo =0; 
    }
    if (args.movimientos_bodegas.fecha_vencimiento === '') {
        res.send(G.utils.r(req.url, 'El fecha_vencimiento esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.lote === '') {
        res.send(G.utils.r(req.url, 'El lote esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.localizacion === '') {
        res.send(G.utils.r(req.url, 'La localizacion esta vacía', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.total_costo_ped === '') {
        res.send(G.utils.r(req.url, 'El total_costo_ped esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.valor_unitario === '') {
        res.send(G.utils.r(req.url, 'El valor_unitario esta vacío', 404, {}));
        return;
    }
    
    if (args.movimientos_bodegas.cantidad === '') {
        res.send(G.utils.r(req.url, 'La cantidad esta vacía', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.item_id_compras === '') {
        res.send(G.utils.r(req.url, 'El item_id_compras esta vacío', 404, {}));
        return;
    }
  
    parametros ={
                 usuarioId: args.movimientos_bodegas.usuario_id,
                 docTmpId: args.movimientos_bodegas.doc_tmp_id,
                 codProucto: args.movimientos_bodegas.codigo_producto,
                 cantidad :args.movimientos_bodegas.cantidad,
                 porcentajeGravamen:args.movimientos_bodegas.porcentaje_gravamen,
                 totalCosto:args.movimientos_bodegas.total_costo,
                 fechaVencimiento:args.movimientos_bodegas.fecha_vencimiento,
                 lote:args.movimientos_bodegas.lote,
                 localProd:args.movimientos_bodegas.localizacion,
                 totalCostoPed:args.movimientos_bodegas.total_costo_ped,
                 valorUnitario:args.movimientos_bodegas.valor_unitario,
                 itemIdCompras:args.movimientos_bodegas.item_id_compras,
                };
    G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaBodega", parametros).then(function(result) {

        
        
        if(result.length===0){
            throw {msj:"EL producto "+args.movimientos_bodegas.codigo_producto+" no esta relacionado en existencias_bodega.", status:403};        
        }else{
            parametros.empresa=result[0].empresa_id;
            parametros.centroUtilidad=result[0].centro_utilidad;
            parametros.bodega=result[0].bodega;
            return G.Q.ninvoke(that.m_movimientos_bodegas, "isBodegaDestino", parametros);            
        }
    }).then(function(result) {
        if(result.length!==0){
            parametros.bodegaDestino=result.bodega_destino;
             return G.Q.nfcall(__traslado,that,parametros);
        }
        return false;
    }).then(function(result) {      
        return G.Q.ninvoke(that.m_ordenes_compra, "ingresarBodegaMovimientoTmpProducto", parametros);  
    }).then(function(result) { 
         res.send(G.utils.r(req.url, 'Guardado correctamente', 200, {addItemDocTemporal: result}));   
    }).fail(function(err) {
        console.log("addItemDocTemporal ",err);
        res.send(G.utils.r(req.url, err.msj, err.status, {addItemDocTemporal: []}));
    }).done();
   
};

function __traslado(that,parametros,callback){
  var dBodega;
  var dProducto;
   G.Q.ninvoke(that.m_movimientos_bodegas, "isTrasladosTmp", parametros).then(function(result) {
       if(result.length===0){
            throw {msj:"EL producto "+parametros.codigo_producto+" no esta relacionado en existencias_bodega.", status:403};        
        }else{
            dBodega=result.dBodega;
            dProducto=result.dProducto;
            return G.Q.ninvoke(that.m_movimientos_bodegas, "isExistenciaEnBodega", parametros);            
        }
    }).then(function(result) {
        if(result.codigo_producto===''){
            throw {msj:"EL PRODUCTO:"+parametros.codigo_producto+" - "+dProducto+" NO EXISTE EN BODEGA: "+dBodega, status:403};   
        }else{
            callback(false);
        }
    }).fail(function(err) {
        callback(true,err);        
    }).done();
}

MovBodegasController.prototype.crearDocumento=function(req,res){
   var that = this;
   var args = req.body.data;
   var usuarioId;
   

    if (args.movimientos_bodegas.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.orden_pedido_id === '') {
        res.send(G.utils.r(req.url, 'El orden_pedido_id esta vacío', 404, {}));
        return;
    }
    
    if (args.movimientos_bodegas.usuario_id === '') {
       usuarioId = req.session.user.usuario_id;
    }else{
       usuarioId = args.movimientos_bodegas.usuario_id;
    }
    
    var ordenPedidoID=args.movimientos_bodegas.orden_pedido_id;
    
    var docTmpId= args.movimientos_bodegas.doc_tmp_id;
    var parametros = {usuario_id: usuarioId, orden_pedido_id: ordenPedidoID}; 
    G.Q.ninvoke(that.m_I002, "listarGetItemsDocTemporal", parametros).then(function(result) {
        
        if (result.length > 0) {
          
          return G.Q.ninvoke(that.m_movimientos_bodegas,"consultarDocumentoBodegaTemporal",docTmpId, usuarioId);                
        }else{
          throw {msj:"No hay datos en listarGetItemsDocTemporal.", status:403};   
        }
        
    }).then(function(result) {
        if (result.length === 0) {
           throw {msj:"DATOS ADICIONALES DEL DOCUMENTO NO ESTAN LLENOS.", status:403};        
        }else{
          
          res.send(G.utils.r(req.url, 'crearDocumento', 200, {crearDocumento: result})); 
        }
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar Items Documento Temporal', 500, {}));
    }).done();
};

MovBodegasController.prototype.obtenerDocumetosTemporales=function(req,res){
   var that = this;
  
   var args = req.body.data;
   
   if (args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'El empresaId esta vacío', 404, {}));
        return;
    }
   if (args.centroUtilidadId === undefined) {
        res.send(G.utils.r(req.url, 'El centroUtilidadId esta vacío', 404, {}));
        return;
    }
   if (args.bodegaId === undefined) {
        res.send(G.utils.r(req.url, 'El bodegaId esta vacío', 404, {}));
        return;
    }
   if (args.tipoDocGeneralId === undefined) {
        res.send(G.utils.r(req.url, 'El tipoDocGeneralId esta vacío', 404, {}));
        return;
    }
   if (args.invTipoMovimiento === undefined) {
        res.send(G.utils.r(req.url, 'El invTipoMovimiento esta vacío', 404, {}));
        return;
    }
    if(args.numeroDocumento === undefined){
        args.numeroDocumento='';
    }
  
   var parametros = {
                        empresaId: args.empresaId, 
                        centroUtilidadId: args.centroUtilidadId, 
                        bodegaId:args.bodegaId, 
                        tipoDocGeneralId:args.tipoDocGeneralId.tipo, 
                        invTipoMovimiento:args.invTipoMovimiento,
                        numeroDocumento: args.numeroDocumento,
                        paginaActual: args.paginaActual
                    }; 

    G.Q.ninvoke(that.m_movimientos_bodegas, "obtenerDocumetosTemporales", parametros).then(function(result) {

     res.send(G.utils.r(req.url, 'obtenerDocumetosTemporales', 200, {obtenerDocumetosTemporales: result})); 

    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar obtenerDocumetosTemporales', 500, {err:err}));
    }).done();
};

MovBodegasController.prototype.getDocumentosBodegaUsuario=function(req,res){
    var that = this;

    var args = req.body.data;
    var paginaActual = args.paginaActual;
    
    if (args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'El empresaId esta vacío', 404, {}));
        return;
    }
    if (args.centroUtilidadId === undefined) {
        res.send(G.utils.r(req.url, 'El centroUtilidadId esta vacío', 404, {}));
        return;
    }
    if (args.bodegaId === undefined) {
        res.send(G.utils.r(req.url, 'El bodegaId esta vacío', 404, {}));
        return;
    }
    if (args.tipoDocGeneralId === undefined) {
        res.send(G.utils.r(req.url, 'El tipoDocGeneralId esta vacío', 404, {}));
        return;
    }
    if (args.invTipoMovimiento === undefined) {
        res.send(G.utils.r(req.url, 'El invTipoMovimiento esta vacío', 404, {}));
        return;
    }
    if (args.numeroDocumento === undefined) {
        args.numeroDocumento = '';
    }
    if (paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }
    
   var parametros = {
                        empresaId: args.empresaId, 
                        centroUtilidadId: args.centroUtilidadId, 
                        bodegaId:args.bodegaId, 
                        tipoDocGeneralId:args.tipoDocGeneralId, 
                        invTipoMovimiento:args.invTipoMovimiento,
                        numeroDocumento: args.numeroDocumento,
                        paginaActual: paginaActual
                    }; 
   
    G.Q.ninvoke(that.m_movimientos_bodegas, "getDocumentosBodegaUsuario", parametros).then(function(result) {
 
     res.send(G.utils.r(req.url, 'getDocumentosBodegaUsuario', 200, {getDocumentosBodegaUsuario: result})); 

    }).fail(function(err) {
        console.log("Error getDocumentosBodegaUsuario",err);
        res.send(G.utils.r(req.url, 'Error al Listar getDocumentosBodegaUsuario', 500, {}));
    }).done();
};

MovBodegasController.prototype.getTiposDocumentosBodegaUsuario=function(req,res){
   var that = this;
  
   var args = req.body.data;
   
    
    var parametros = {empresaId: args.empresa_id, centroUtilidadId: args.centro_utilidad_id, bodegaId:args.bodega_id,invTipoMovimiento:args.invTipoMovimiento}; 
    
    G.Q.ninvoke(that.m_movimientos_bodegas, "getTiposDocumentosBodegaUsuario", parametros).then(function(result) {
 
     res.send(G.utils.r(req.url, 'getTiposDocumentosBodegaUsuario', 200, {getTiposDocumentosBodegaUsuario: result})); 

    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar obtenerDocumetosTemporales', 500, {}));
    }).done();
};

MovBodegasController.prototype.getTiposDocumentosBodegaEmpresa=function(req,res){
   var that = this;
  
   var args = req.body.data;
   
    
    var parametros = {empresaId: args.empresa_id, centroUtilidadId: args.centro_utilidad_id, bodegaId:args.bodega_id,invTipoMovimiento:args.invTipoMovimiento}; 
    
    G.Q.ninvoke(that.m_movimientos_bodegas, "getTiposDocumentosBodegaEmpresa", parametros).then(function(result) {
 
     res.send(G.utils.r(req.url, 'getTiposDocumentosBodegaEmpresa', 200, {getTiposDocumentosBodegaEmpresa: result})); 

    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error al Listar obtenerDocumetosTemporales', 500, {}));
    }).done();
};



MovBodegasController.prototype.execCrearDocumento=function(req,res){
 var that = this;
   var args = req.body.data;
   var usuarioId;
   

    if (args.movimientos_bodegas.doc_tmp_id === '') {
        res.send(G.utils.r(req.url, 'El doc_tmp_id esta vacío', 404, {}));
        return;
    }
    if (args.movimientos_bodegas.orden_pedido_id === '') {
        res.send(G.utils.r(req.url, 'El orden_pedido_id esta vacío', 404, {}));
        return;
    }
    
    if (args.movimientos_bodegas.usuario_id === '') {
       usuarioId = req.session.user.usuario_id;
    }else{
       usuarioId = args.movimientos_bodegas.usuario_id;
    }
    
    var ordenPedidoID=args.movimientos_bodegas.orden_pedido_id;
    
    var docTmpId= args.movimientos_bodegas.doc_tmp_id;
    
    G.knex.transaction(function(transaccion) {  
        
            G.Q.nfcall(that.m_movimientos_bodegas.crear_documento, docTmpId, usuarioId, transaccion).then(function(result){

                    doc = result;
               
                    
           }).then(function(err){
               console.log("execCrearDocumento::: ",err);
                 return G.Q.nfcall(__eliminar_documento_temporal_farmacias,documento_temporal_id, usuario_id, transaccion);
           }).fail(function(err){
               console.log("error generado >>>>>>>>>>>>", err);
               transaccion.rollback(err);
           }).
           done();
    
    }).then(function(){
        
       callback(false, doc.empresa_id, doc.prefijo_documento, doc.numeracion_documento);
        
    }).catch(function(err){
        callback(err);
    }).
    done();
    
//    var parametros = {usuario_id: usuarioId, orden_pedido_id: ordenPedidoID}; 
//    G.Q.ninvoke(that.m_I002, "listarGetItemsDocTemporal", parametros).then(function(result) {
//        
//        if (result.length > 0) {
//          console.log("result::: ",result);  
//          return G.Q.ninvoke(that.m_movimientos_bodegas,"consultarDocumentoBodegaTemporal",docTmpId, usuarioId);                
//        }else{
//          throw {msj:"NO HAY REGISTROS EN EL DOCUMENTO TEMPORAL "+docTmpId+" DEL USUARIO "+usuarioId+" PARA CREAR UN DOCUMENTO.", status:403};   
//        }
//        
//    }).then(function(result) {
//        if (result.length === 0) {
//           throw {msj:"NO HAY REGISTROS EN LA CABECERA TEMPORAL.", status:403};        
//        }else{
//            
//               G.knex.transaction(function(transaccion) {
//     ///////////////////////       
//                var parametros={documentoId:'',empresaId:''};
//                G.Q.nfcall(that.m_movimientos_bodegas.lokTableDocumetos,parametros, transaccion).then(function(result) {
//                  if (result.length === 0) {
//                    throw {msj:"NO HAY REGISTROS EN LA CABECERA TEMPORAL.", status:403};        
//                  }else{
//                    return G.Q.nfcall(that.m_movimientos_bodegas.insertarBodegasMovimientoOrdenesCompraTmp, parametros, transaccion);
//                  }
//                }).then(function() {
//                    transaccion.commit(parametros.documentoId);
//                }).fail(function(err) {                   
//                    transaccion.rollback(err);
//                }).done();
//            
//        }).then(function(movimiento_temporal_id) {
//            res.send(G.utils.r(req.url, 'Temporal guardado correctamente', 200, {movimiento_temporal_id: movimiento_temporal_id}));
//        }).catch (function(err) {
//            res.send(G.utils.r(req.url, 'Error al insertar la cabecera del temporal', 500, {}));
//        }).done();
//            
//    //////////////////        
//          console.log("result::: ",result);
//          res.send(G.utils.r(req.url, 'crearDocumento', 200, {crearDocumento: result})); 
//        }
//    }).fail(function(err) {
//        res.send(G.utils.r(req.url, 'Error al Listar Items Documento Temporal', 500, {}));
//    }).done();

};

/*MovBodegasController.prototype.imprimirDocumentoDespacho = function(req, res){
    var that = this;
    var args = req.body.data;
    
    
    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.numero === undefined || args.movimientos_bodegas.prefijo === undefined
        || args.movimientos_bodegas.empresa === undefined) {
    
        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan definidos', 404, {}));
        return;
    }
    
    if (args.movimientos_bodegas.numero === "" || args.movimientos_bodegas.prefijo === "" || args.movimientos_bodegas.empresa === "") {
        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan vacios', 404, {}));
        return;
    }
    
    var numero = args.movimientos_bodegas.numero;
    var prefijo = args.movimientos_bodegas.prefijo;
    var empresa = args.movimientos_bodegas.empresa;
    var datos_documento = {};
    
    that.m_movimientos_bodegas.obtenerEncabezadoDocumentoDespacho(numero, prefijo, empresa, req.session.user.usuario_id, function(err, rows){
        if (err || rows.length === 0) {

            res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
            return;
        }
        datos_documento.encabezado = rows[0];
        
        that.m_movimientos_bodegas.obtenerDetalleDocumentoDespacho(numero, prefijo, empresa, function(err, rows){
            if (err) {
                res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                return;
            }
            
            datos_documento.detalle = rows;
            that.m_movimientos_bodegas.obtenerDatosAdicionalesPorDocumento(numero, prefijo, empresa, datos_documento.encabezado.tipo_doc_bodega_id, function(err, rows){
                if (err || rows.length === 0 ) {
                    res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                    return;
                }
                                
                datos_documento.adicionales = that.m_movimientos_bodegas.darFormatoTituloAdicionesDocumento(rows[0]);
                
                __generarPdfDespacho(datos_documento, function(nombre_pdf){
                    console.log("nombre generado ", nombre_pdf);
                    res.send(G.utils.r(req.url, 'Documento Generado Correctamete', 200, {movimientos_bodegas: {nombre_pdf:nombre_pdf}}));
                });

            });
            
            
        });
        
    });
    
};*/


/*function __generarPdfDespacho(datos, callback){
    G.jsreport.reporter.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/MovBodegas/reports/despacho.html', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width:'700px'
            }
        },
        data: datos
    }).then(function(response) {

        var name = response.result.path;
        var nombreTmp = datos.encabezado.prefijo + "-" + datos.encabezado.numero + ".pdf";
        G.fs.copySync(name, G.dirname + "/public/reports/" + nombreTmp);

        callback(nombreTmp);
    });
}*/


MovBodegasController.$inject = ["m_movimientos_bodegas","m_ordenes_compra","m_i002"];

module.exports = MovBodegasController;