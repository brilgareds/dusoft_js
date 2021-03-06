
/* global G */

var DispensacionHc = function(m_dispensacion_hc, eventos_dispensacion, m_usuarios, e_dispensacion_hc, m_productos) {
    
    this.m_dispensacion_hc = m_dispensacion_hc;
    this.e_dispensacion_hc = eventos_dispensacion;
    this.m_usuarios = m_usuarios;
    this.e_dispensacion_hc = e_dispensacion_hc;
    this.m_productos = m_productos;
    
   
};

DispensacionHc.prototype.eliminarFormulasSinMovimiento = function(){
    
    var that = this;
    
    G.Q.ninvoke(that.m_dispensacion_hc,'eliminarFormulasSinMovimiento').then(function(resultado){
   
    if(resultado.length >0){
        throw {msj:'[eliminarFormulasSinMovimiento]: Se elimina satisfactoriamente', status: 201}; 
    }else{
        throw {msj:'[eliminarFormulasSinMovimiento]: No se eliminaron los registros', status: 404}; 
    }
        
    }).fail(function(err){      
        console.log(" err ", err);  
    }).done();
};
                                         
function __sincronizacionProductos(that,productos,index,callback) {
    var parametros;
    producto=productos.codigoProducto[index];
    
    if(!producto){
        callback(false,true);
        return;
    }
    
    var producto ={codigoProducto : producto["$value"]};
    
    G.Q.ninvoke(that.m_productos, 'buscarProductosCodificacion',producto).then(function (resultado) {
        parametros = resultado[0];
        var funcion = "modificar_productoinsumo";
        var datos = {
            descripcion_titular_reginvima: parametros.descripcion_titular_reginvima,
            tipo_pais_titular_reginvima_id: parametros.tipo_pais_titular_reginvima_id,
            descripcion_tratamiento: parametros.descripcion_tratamiento,
            descripcion_cod_anatofarmacologico: parametros.descripcion_cod_anatofarmacologico,
            descripcion_unidad: parametros.descripcion_unidad,
            abreviatura_unidad: parametros.abreviatura_unidad,
            descripcion_med_cod: parametros.descripcion_med_cod,
            unidad_dosificacion: parametros.unidad_dosificacion,
            sw_dosificacion: parametros.sw_dosificacion,
            grupo_id: parametros.grupo_id,
            descripcion_grupo: parametros.grupo_id,
            sw_medicamento: parametros.sw_medicamento,
            clase_id: parametros.clase_id,
            descripcion_clase: parametros.descripcion_clase,
            sw_tipo_empresa: parametros.sw_tipo_empresa,
            descripcion_subclase: parametros.descripcion_subclase,
            molecula_id: parametros.molecula_id,
            subclase_id: parametros.subclase_id,
            descripcion: parametros.descripcion,
            descripcion_abreviada: parametros.descripcion_abreviada,
            codigo_cum: parametros.codigo_cum,
            codigo_alterno: parametros.codigo_alterno,
            codigo_barras: parametros.codigo_barras,
            fabricante_id: parametros.fabricante_id,
            sw_pos: parametros.sw_pos,
            cod_acuerdo228_id: parametros.cod_acuerdo228_id,
            unidad_id: parametros.unidad_id,
            cantidad: parametros.cantidad,
            cod_anatofarmacologico: parametros.cod_anatofarmacologico,
            mensaje_id: parametros.mensaje_id,
            codigo_mindefensa: parametros.codigo_mindefensa,
            codigo_invima: parametros.codigo_invima,
            vencimiento_codigo_invima: parametros.vencimiento_codigo_invima,
            titular_reginvima_id: parametros.titular_reginvima_id,
            porc_iva: parametros.porc_iva,
            sw_generico: parametros.sw_generico,
            sw_venta_directa: parametros.sw_venta_directa,
            tipo_pais_id: parametros.tipo_pais_id,
            tipo_producto_id: parametros.tipo_producto_id,
            presentacioncomercial_id: parametros.presentacioncomercial_id,
            cantidad_p: parametros.cantidad_p,
            tratamiento_id: parametros.tratamiento_id,
            usuario_id: parametros.usuario_id,
            cod_presenta: parametros.cod_presenta,
            dci: parametros.dci_id,
            estado_unico: parametros.estado_unico,
            sw_solicita_autorizacion: parametros.sw_solicita_autorizacion,
            codigo_producto: parametros.codigo_producto,
            rips_no_pos: parametros.rips_no_pos
        };
        
        return G.Q.nfcall(__swSincronizarProductos, funcion, datos);

    }).then(function (resultado) {
        var datos = {
            descripcion_cod_anatofarmacologico: parametros.descripcion_cod_anatofarmacologico,
            descripcion_med_cod: parametros.descripcion_med_cod,
            unidad_dosificacion: parametros.unidad_dosificacion,
            sw_dosificacion: parametros.sw_dosificacion,
            descripcion_medida_medicamento: parametros.descripcion_medida_medicamento,
            descripcion_principio_activo: parametros.descripcion_principio_activo,
            sw_manejo_luz: parametros.sw_manejo_luz,
            cod_forma_farmacologica: parametros.descripcion_medida_medicamento,
            concentracion: parametros.concentracion,
            cod_principio_activo: parametros.cod_principio_activo,
            cod_concentracion: parametros.cod_concentracion,
            sw_liquidos_electrolitos: parametros.sw_liquidos_electrolitos,
            sw_uso_controlado: parametros.sw_uso_controlado,
            sw_antibiotico: parametros.sw_antibiotico,
            sw_refrigerado: parametros.sw_refrigerado,
            sw_alimento_parenteral: parametros.sw_alimento_parenteral,
            sw_alimento_enteral: parametros.sw_alimento_enteral,
            dias_previos_vencimiento: parametros.dias_previos_vencimiento,
            cod_anatofarmacologico: parametros.cod_anatofarmacologico,
            sw_pos: parametros.sw_pos,
            codigo_cum: parametros.codigo_cum,
            unidad_id: parametros.unidad_id,
            sw_farmacovigilancia: parametros.sw_farmacovigilancia,
            descripcion_alerta: parametros.descripcion_alerta,
            usuario_id: parametros.usuario_id,
            codigo_producto: parametros.codigo_producto,
            tipo_pais_titular_reginvima_id: parametros.tipo_pais_titular_reginvima_id,
            descripcion_titular_reginvima: parametros.descripcion_titular_reginvima,
            titular_reginvima_id: parametros.titular_reginvima_id,
            estado_invima: parametros.estado_invima
        };

        if (resultado.mensaje === '1') {
            var funcion = "modificar_productomedicamento";
            return G.Q.nfcall(__swSincronizarProductos, funcion, datos);
        } else {
            throw {msj: "Se ha generado un error al sincronizar la funcion modificar_productoinsumo <<sincronizacionProductos>>", status: 403, obj: {}};
        }

    }).then(function (resultado) {

        if (resultado.mensaje === '1') {         
            index++;
            __sincronizacionProductos(that,productos,index,callback);
        } else {           
            index++;
            __sincronizacionProductos(that, productos, index, callback);
        }

    }).fail(function (err) {
        console.log("Error ", err);
        callback(err);
    }).done();
};

function __swSincronizarProductos(funcion, parametros, callback) {
    var obj = {};
    
    var url = G.constants.WS().DISPENSACION_HC.CODIFICACION_PRODUCTOS;

    G.Q.nfcall(G.soap.createClient, url).then(function (client) {

        return G.Q.ninvoke(client, funcion, parametros);

    }).spread(function (result, raw, soapHeader) {

       // G.logError(JSON.stringify(result.return));

        if (!result.return["$value"]) {
            throw {msj: "Se ha generado un error", status: 403, obj: {}};
        } else {
            obj.mensaje = result.return["$value"];
        }

    }).then(function () {

        callback(false, obj);

    }).fail(function (err) {

        obj.error = true;
        obj.tipo = '0';       
        G.logError(JSON.stringify(err));
        callback(err);

    }).done();
}

DispensacionHc.prototype.sincronizacionFormulasDispensadas = function(){
    
    var that = this;
    
    G.Q.nfcall(__sincronizacionFormulasDispensadas,that).then(function(resultado){
        
    
    }).fail(function(err){      
        console.log(" err ", err);  
    }).done();
};

function __sincronizacionFormulasDispensadas(that,callback){
    G.Q.ninvoke(that.m_dispensacion_hc,'formulasDispensadas',{}).then(function(resultado){
        
        return G.Q.nfcall(__codificarFormulasDispensadas,resultado,0,[]);
     
    }).then(function(resultado){  

        if(resultado.length >0){
            return G.Q.nfcall(__wsSincronizarFormulasDispensadas,resultado); 
        }else{
            throw {msj:'[formulasDispensadas]: Consulta Sin datos', status: 404}; 
        }
        
    }).then(function(resultado){
 
     if(resultado.isProducto){
     
       return G.Q.nfcall(__sincronizacionProductos,that,resultado,0);
       
     }else{
       
       callback(false,true);
       return;
     }
     
    }).then(function(resultado){
        
         if(resultado){
           
             __sincronizacionFormulasDispensadas(that,callback);
         }else{
              
           callback(false, true);  
         }
        
    }).fail(function(err){      
        console.log(" err ", err); 
        callback(err);
    }).done();
}

function __codificarFormulasDispensadas(productos, index, resultado, callback){
  var producto = productos[index];
  
  if(!producto){
   callback(false,resultado);
   return;
  }
                  
  var detalle ={
                "numero_formula":  String(producto.numero_formula),
                "tipo_formula":  String(producto.tipo_formula),
                "codigo_producto":  String(producto.codigo_producto_formulado),
                "codigo_producto_despachado":  String(producto.codigo_producto_despachado),
                "cantidad_despachada":  String(parseInt(producto.cantidad)),
                "numero_entrega":  String(producto.numero_entega),
                "fecha_dispensacion":  String(producto.fecha_dispensacion),
                "fecha_vencimiento":  String(producto.fecha_vencimiento)
               };
               
     resultado.push(detalle);
     index++;
    __codificarFormulasDispensadas(productos, index, resultado, callback);           
  
}

function __wsSincronizarFormulasDispensadas(parametros,callback){
    var obj={};
    var datos2;
    var client;
    var url =  G.constants.WS().DISPENSACION_HC.FORMULAS_DISPENSADAS;
   
   var credentials = [];           
    var ws_dispensation1 = {
        login :'duana_dispensacion'
    };  
    var ws_dispensation2 = {
        password :'duana_dispensacion'
    };  
    var ws_dispensation3 = {
       trace : 1
    };  
    var ws_dispensation = {
        login : 'duana_dispensacion',
        password : 'duana_dispensacion',
        trace : 1
    };  
     credentials.push(ws_dispensation1);         
     credentials.push(ws_dispensation2); 
     credentials.push(ws_dispensation3); 
     
     var options = {
    hasNonce: true,
    actor: 'actor'
  };
  
    G.Q.nfcall(G.soap.createClient, url).then(function(client) {
 
      client.addSoapHeader(ws_dispensation);

        var datos = {
                 data:parametros
               };
    return G.Q.ninvoke(client, "getDispensation", datos);
                
    }).spread(function(result,raw,soapHeader){

        

    // G.logError(result.return.message["$value"]);          
     
        if(!result.return){
            throw {msj:"Se ha generado un error", status:403, obj:{}}; 
        } else {            
            obj.mensaje = result.return.message["$value"];
            obj.isProducto = false;
            if(result.return.productsWithoutExistence !== undefined){
               
            obj.codigoProducto = result.return.productsWithoutExistence.item;
            obj.isProducto = true;
            }
        }
    }).then(function(resultado){
        
     callback(false, obj);    

    }).fail(function(err) {
        
        obj.error = true;
        obj.tipo = '0';
        G.logError(JSON.stringify(err));
        callback(err);

    }).done();   
}

/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar la lista de formulas
 *              
 */
DispensacionHc.prototype.listarFormulas = function(req, res){
        
    var that = this;
    var args = req.body.data;
    
    if (args.listar_formulas === undefined || args.listar_formulas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_formulas: []}));
        return;
    }
     
    if (args.listar_formulas.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.listar_formulas.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {pedidos_clientes: []}));
        return;
    }
    
    if (!args.listar_formulas.filtro ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    if (!args.listar_formulas.terminoBusqueda || args.listar_formulas.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, 'Debe diligenciar el termino de busqueda', 404, {}));
        return;
    }
    
    
    var empresaId = args.listar_formulas.empresaId;
    var terminoBusqueda = args.listar_formulas.terminoBusqueda;
    var paginaActual = args.listar_formulas.paginaActual;
    var filtro = args.listar_formulas.filtro;
    var fechaInicial = args.listar_formulas.fechaInicial;
    var fechaFinal = args.listar_formulas.fechaFinal;
    var estadoFormula = args.listar_formulas.estadoFormula;
    var usuario = req.session.user.usuario_id;
   
   
   var parametros={ empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                    filtro: filtro,
                    estadoFormula: estadoFormula,
                    usuarioId : usuario};
                
                 
    G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametros).then(function(resultado){
   
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar los tipos de documentos
 *              
 */
DispensacionHc.prototype.listarTipoDocumento = function(req, res){
    
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_dispensacion_hc,'listarTipoDocumento').then(function(resultado){
      
        if(resultado.length > 0){
       
           res.send(G.utils.r(req.url, 'Consulta tipo documento', 200, {listar_tipo_documento:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
      
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar las formulas que
 *              tienen medicamentos pendientes
 *              
 */
DispensacionHc.prototype.listarFormulasPendientes = function(req, res){
    
    var that = this;
    var args = req.body.data;
  
    if (args.listar_formulas === undefined || args.listar_formulas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_formulas: []}));
        return;
    }
     
    if (args.listar_formulas.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.listar_formulas.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {pedidos_clientes: []}));
        return;
    }
    
    if (!args.listar_formulas.filtro ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    if (!args.listar_formulas.terminoBusqueda || args.listar_formulas.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, 'Debe diligenciar el termino de busqueda', 404, {}));
        return;
    }
    
    
    var empresaId = args.listar_formulas.empresaId;
    var terminoBusqueda = args.listar_formulas.terminoBusqueda;
    var paginaActual = args.listar_formulas.paginaActual;
    var filtro = args.listar_formulas.filtro;
    var fechaInicial = args.listar_formulas.fechaInicial;
    var fechaFinal = args.listar_formulas.fechaFinal;
    var estadoFormula = args.listar_formulas.estadoFormula;
    
   
   
   var parametros={ empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                    filtro: filtro,
                    estadoFormula: estadoFormula};
        
   G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulasPendientes',parametros).then(function(resultado){
    
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
    }else{
        throw 'No hay medicamentos pendientes';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
    
   
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista de los medicamentos
 *              formulados
 *              
 */
DispensacionHc.prototype.cantidadProductoTemporal = function(req, res){
     
    var that = this;
    var args = req.body.data;
   
    if (args.cantidadProducto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_detalle_medicamentos_formulados: []}));
        return;
    }
   
    if (!args.cantidadProducto.codigoProducto || args.cantidadProducto.codigoProducto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {cantidadProducto: []}));
        return;
    }
    
    if (!args.cantidadProducto.evolucionId || args.cantidadProducto.evolucionId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {cantidadProducto: []}));
        return;
    }
    
    var parametros={codigoProducto:args.cantidadProducto.codigoProducto,
                    evolucionId:args.cantidadProducto.evolucionId,
                    principioActivo:args.cantidadProducto.principioActivo
                    };
      
    G.Q.ninvoke(that.m_dispensacion_hc,'cantidadProductoTemporal',parametros).then(function(resultado){
       
        if(resultado.length > 0){
            res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {cantidadProducto:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista de los medicamentos
 *              formulados
 *              
 */
DispensacionHc.prototype.listarMedicamentosFormulados = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.listar_medicamentos_formulados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_formulados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_formulados.evolucionId || args.listar_medicamentos_formulados.evolucionId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {listar_medicamentos_formulados: []}));
        return;
    }

    var parametros = {evolucionId:args.listar_medicamentos_formulados.evolucionId};   
//   console.log("args.listar_medicamentos_formulados::",args.listar_medicamentos_formulados); 
//   console.log("listarMedicamentosFormulados::",parametros); 
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosFormulados',parametros).then(function(resultado){
      
        if(resultado.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_medicamentos_formulados:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista de los medicamentos
 *              formulados
 *              
 */
DispensacionHc.prototype.listarMedicamentosFormuladosPendientes = function(req, res){
        
    var that = this;
    var args = req.body.data;
   
    if (args.listar_medicamentos_pendientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_formulados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_pendientes.evolucionId || args.listar_medicamentos_pendientes.evolucionId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {listar_medicamentos_pendientes: []}));
        return;
    }

    var parametros = {evolucionId:args.listar_medicamentos_pendientes.evolucionId};
    
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesPorDispensar',parametros).then(function(resultado){
       
    
        if(resultado.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_medicamentos_pendientes:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
 
    
/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista los lotes de cada 
 *              codigo del producto del FOFO
 *              
 */
DispensacionHc.prototype.consultarLotesDispensarFormula = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.existenciasBodegas === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {existenciasBodegas: []}));
        return;
    }
   
    if (!args.existenciasBodegas.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.empresa || args.existenciasBodegas.empresa.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.centroUtilidad || args.existenciasBodegas.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.bodega || args.existenciasBodegas.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.codigoFormaFarmacologica) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de forma farmacologica', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.pacienteId || args.existenciasBodegas.pacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el documento del paciente', 404, {existenciasBodegas: []}));
        return;
    }
    if (!args.existenciasBodegas.tipoPacienteId || args.existenciasBodegas.tipoPacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento del paciente', 404, {existenciasBodegas: []}));
        return;
    }
    
    var parametros={empresa: args.existenciasBodegas.empresa,
                    centroUtilidad:args.existenciasBodegas.centroUtilidad, 
                    bodega:args.existenciasBodegas.bodega,
                    codigoProducto:args.existenciasBodegas.codigoProducto,
                    principioActivo:args.existenciasBodegas.principioActivo,
                    codigoFormaFarmacologica: args.existenciasBodegas.codigoFormaFarmacologica
                    };
       
       
            
    G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros).then(function(resultado){
        
       if(resultado || resultado.length > 0){ 
             res.send(G.utils.r(req.url, 'Consulta los lotes de cada producto de los FOFO', 200, {existenciasBodegas:resultado}));
       }else{
           throw {msj: "Consulta sin resultado", codigo: 500};
       }
           
   }).fail(function(err){     
      res.send(G.utils.r(req.url, err.msj, err.codigo, {existenciasBodegas: []}));
      
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista los lotes de cada 
 *              codigo del producto del FOFO
 *              
 */
DispensacionHc.prototype.existenciasBodegas = function(req, res){
   
    var today = new Date();
    
    var formato = 'YYYY-MM-DD';
    var fechaExtTicinco=G.moment().subtract(25,'days').format(formato);
    var fechaToday = G.moment(today).format(formato);
    var that = this;
    var args = req.body.data;
    var fechaRegistro = "";
    var fechaDespacho = "";
    var def = G.Q.defer();
    
    if (args.existenciasBodegas === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {existenciasBodegas: []}));
        return;
    }
   
    if (!args.existenciasBodegas.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.empresa || args.existenciasBodegas.empresa.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.centroUtilidad || args.existenciasBodegas.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.bodega || args.existenciasBodegas.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.codigoFormaFarmacologica) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de forma farmacologica', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.pacienteId || args.existenciasBodegas.pacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el documento del paciente', 404, {existenciasBodegas: []}));
        return;
    }
    if (!args.existenciasBodegas.tipoPacienteId || args.existenciasBodegas.tipoPacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento del paciente', 404, {existenciasBodegas: []}));
        return;
    }
    
    var parametros={empresa: args.existenciasBodegas.empresa,
            centroUtilidad:args.existenciasBodegas.centroUtilidad, 
            bodega:args.existenciasBodegas.bodega,
            codigoProducto:args.existenciasBodegas.codigoProducto,
            principioActivo:args.existenciasBodegas.principioActivo,
            codigoFormaFarmacologica: args.existenciasBodegas.codigoFormaFarmacologica
        };
       
        
   var parametrosUltimoRegistroDispensacion = {tipoIdPaciente: args.existenciasBodegas.tipoPacienteId, 
            pacienteId: args.existenciasBodegas.pacienteId,
            principioActivo: args.existenciasBodegas.principioActivo, 
            producto: args.existenciasBodegas.codigoProducto,
            fechaDia: fechaExtTicinco,
            today: fechaToday,
            movimientoFormulaPaciente: 1
        };
                                             
         
        
G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimoRegistroDispensacion', parametrosUltimoRegistroDispensacion).then(function(resultado){
          
        if(resultado.length > 0){ 
             
            fechaRegistro = resultado[0].fecha_registro;
        }
         
        
        if(fechaToday >= fechaRegistro){
             
            /**
              *+Descripcion: Si no hay ninguna dispensacion del producto anteriormente
              *              Se le descuentan a la fecha despacho 23 dias sobre la fecha actual
              *              para que permita cumplir la condicion de que la diferencia de dias
              *              supera los 23 y posteriormente continue con la seleccion del lote
              *              de lo contrario debe confrontar contra la ultima fecha de registro
              *              del producto
              **/
            if(!fechaRegistro){                
                 fechaDespacho = fechaExtTicinco;
            }else{
                fechaDespacho = fechaRegistro;
            }
        }
          
        var fechaActual = G.moment(fechaToday);
        var fechaUltimaEntregaProducto  = G.moment(fechaDespacho);
        var diferenciaDeDias = fechaActual.diff(fechaUltimaEntregaProducto, 'days');
             
        if(diferenciaDeDias > 23 || args.existenciasBodegas.autorizado === '1' || args.existenciasBodegas.autorizado === ""){
         
            return G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros);
           
         }else{
            def.resolve();             
            throw {msj: resultado, codigo: 204};
         }
   
   }).then(function(resultado){
       
       if(resultado || resultado.length > 0){ 
             res.send(G.utils.r(req.url, 'Consulta los lotes de cada producto de los FOFO', 200, {existenciasBodegas:resultado}));
       }else{
           throw {msj: "Consulta sin resultado", codigo: 500};
       }
           
   }).fail(function(err){     
      res.send(G.utils.r(req.url, err.msj, err.codigo, {existenciasBodegas: []}));
     
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar si el usuario cuenta con 
 *              privilegios para autorizar los medicamentos confrontados
 *              
 */
DispensacionHc.prototype.usuarioPrivilegios = function(req, res){
    
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    
    if (!args.existenciasBodegas.empresa || args.existenciasBodegas.empresa.length === 0 ) {
           res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
           return;
       }
    
    if (!args.existenciasBodegas.centroUtilidad || args.existenciasBodegas.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.bodega || args.existenciasBodegas.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    var parametros={empresa_id: args.existenciasBodegas.empresa,
            usuario_id:usuario,
            modulos:['dispensar_formulas'], 
            convertirJSON:true,
            limpiarCache:true,
            guardarResultadoEnCache:false
        };
        
    G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametros).then(function(parametrizacion){
        
        
       var opciones = (parametrizacion.modulosJson && parametrizacion.modulosJson.dispensar_formulas) ? parametrizacion.modulosJson.dispensar_formulas.opciones : undefined;
        
        if(opciones){

            res.send(G.utils.r(req.url, 'Usuario con privilegios de autorizar dispensacion', 200, {privilegios:opciones}));

        } else {

            throw "Consulta sin resultado";
        }
   
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador autorizar una dispensacion de un medicamento en caso
 *              de este ser confrontado
 *              
 */
DispensacionHc.prototype.autorizarDispensacionMedicamento  = function(req, res){
     
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    if (args.autorizar_dispensacion === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {autorizar_dispensacion: []}));
        return;
    }
   
    if (!args.autorizar_dispensacion.evolucion || args.autorizar_dispensacion.evolucion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    if (!args.autorizar_dispensacion.producto || args.autorizar_dispensacion.producto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo del producto', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    if (!args.autorizar_dispensacion.observacion || args.autorizar_dispensacion.observacion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    var parametros={evolucionId:args.autorizar_dispensacion.evolucion, 
                    usuario:usuario, 
                    observacion: args.autorizar_dispensacion.observacion,
                    producto:args.autorizar_dispensacion.producto,
                    autorizado :'1'};
      
    G.Q.ninvoke(that.m_dispensacion_hc,'autorizarDispensacionMedicamento',parametros).then(function(resultado){
       
        res.send(G.utils.r(req.url, 'Se autoriza la dispensacion del producto', 200, {autorizar_dispensacion:{evolucion_id:resultado}}));
                             
    }).fail(function(err){            
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de almacenar los productos de la formula
 *              en la tabla de temporales
 * @fecha 2016-07-06 (YYYY-DD-MM)
 * 
 */
DispensacionHc.prototype.temporalLotes = function(req, res){
     
    var that = this;
    var args = req.body.data;
   
    if (args.temporalLotes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {existenciasBodegas: []}));
        return;
    }
   
    if (!args.temporalLotes.detalle || args.temporalLotes.detalle.length === 0 ) {
        res.send(G.utils.r(req.url, 'Los parametros estan llegando vacios', 404, {existenciasBodegas: []}));
        return;
    }
    
    if(args.temporalLotes.detalle.cantidadDispensada > args.temporalLotes.detalle.lotes[0].cantidad){
        res.send(G.utils.r(req.url, 'La cantidad dispensada no debe ser mayor a la existencia', 404, {existenciasBodegas: []}));
        return;
    }
    
    if(args.temporalLotes.detalle.cantidadDispensada <= 0){
        res.send(G.utils.r(req.url, 'La cantidad dispensada no debe ser menor ó igual a Cero (0)', 404, {existenciasBodegas: []}));
        return;
    }
    
    if(args.temporalLotes.detalle.estadoProductoVencimiento === 1){
        res.send(G.utils.r(req.url, 'Este lote esta vencido, no puede ser dispensado', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.empresa || args.temporalLotes.empresa.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.centroUtilidad || args.temporalLotes.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.bodega || args.temporalLotes.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
     
    var cantidadDispensada = parseInt(args.temporalLotes.detalle.cantidadDispensada);
    var codigoProductoLote = args.temporalLotes.detalle.codigo_producto;
    var fechaVencimientoLote = args.temporalLotes.detalle.lotes[0].fecha_vencimiento;
    var usuario = req.session.user.usuario_id;
    var medicamentoFormulado = args.temporalLotes.codigoProducto;
    var lote = args.temporalLotes.detalle.lotes[0].codigo_lote;
    
    var parametros={codigoProducto:medicamentoFormulado,
            evolucionId:args.temporalLotes.evolucion,
            principioActivo:args.temporalLotes.detalle.principioActivo
        };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'cantidadProductoTemporal',parametros).then(function(resultado){
        
        var total;
       
        if(resultado.length > 0){         
            total = parseInt(resultado[0].total) + cantidadDispensada;          
        }else{
            total = parseInt(cantidadDispensada);
        }
      
        if( total <= args.temporalLotes.cantidadSolicitada){
             
            var parametrosConsultarProductoTemporal = {
                    evolucionId:args.temporalLotes.evolucion,
                    lote: lote,
                    fechaVencimiento: fechaVencimientoLote,
                    codigoProducto: codigoProductoLote       
                };

            return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal', parametrosConsultarProductoTemporal,0);     

            }else{
                 throw 'La cantidad dispensada no debe ser mayor a la solicitada';
            }
       
    }).then(function(resultado){
        
        var parametrosGuardarProductoTemporal = {
                evolucionId:args.temporalLotes.evolucion,
                empresa: args.temporalLotes.empresa,
                centroUtilidad: args.temporalLotes.centroUtilidad,
                bodega: args.temporalLotes.bodega,
                codigoProducto: codigoProductoLote,
                cantidad: cantidadDispensada,
                fechaVencimiento: fechaVencimientoLote,
                lote: lote,
                formulado: medicamentoFormulado,
                usuario: usuario,
                rango: 0                    
            };
            
        if(resultado.length >0){
            throw 'El lote ya se encuentra registrado en temporal';
        }else{
            return G.Q.ninvoke(that.m_dispensacion_hc,'guardarTemporalFormula', parametrosGuardarProductoTemporal); 
        }
        
    }).then(function(){
         
        res.send(G.utils.r(req.url, 'Se almacena el temporal satisfactoriamente', 200, {existenciasBodegas: []}));  
    
     }).fail(function(err){  
      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();   
      
};

/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador encargado listar los temporales de cada  medicamento
 *              formulado
 *              
 */
DispensacionHc.prototype.listarMedicamentosTemporales = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.listar_medicamentos_temporales === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_temporales: []}));
        return;
    }
   
    if (!args.listar_medicamentos_temporales.evolucion || args.listar_medicamentos_temporales.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {listar_medicamentos_temporales: []}));
        return;
    }

   var parametros = {evolucionId:args.listar_medicamentos_temporales.evolucion};
  
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',parametros,1).then(function(resultado){
      
        if(resultado.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos temporales', 200, {listar_medicamentos_temporales:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
      
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador encargado eliminar los temporales de una formula
 *              
 */
DispensacionHc.prototype.eliminarTemporalFormula  = function(req, res){    
     
    var that = this;              
    var args = req.body.data;
     
    if (args.eliminar_medicamentos_temporales === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
   
    if (!args.eliminar_medicamentos_temporales.evolucion || args.eliminar_medicamentos_temporales.evolucion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    if (args.eliminar_medicamentos_temporales.serialId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el serialId', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    if (!args.eliminar_medicamentos_temporales.codigoProducto || args.eliminar_medicamentos_temporales.codigoProducto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo del producto', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    var parametros={serialId:args.eliminar_medicamentos_temporales.serialId, 
            evolucionId:args.eliminar_medicamentos_temporales.evolucion, 
            codigoProducto:args.eliminar_medicamentos_temporales.codigoProducto
        };
                
     
    G.Q.ninvoke(that.m_dispensacion_hc,'eliminarTemporalFormula',parametros).then(function(resultado){
         
        res.send(G.utils.r(req.url, 'Se elimina temporal satisfactoriamente', 200, {eliminar_medicamentos_temporales:resultado}));
      
   }).fail(function(err){      
      
       res.send(G.utils.r(req.url, 'Error al eliminar el temporal', 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar los tipos de formulas
 *              
 */
DispensacionHc.prototype.listarTipoFormula = function(req, res){
    var that = this;
    var args = req.body.data;
    if (!args.listar_tipo_formula) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_tipo_formula: []}));
        return;
    }
    
    G.Q.ninvoke(that.m_dispensacion_hc,'listarTipoFormula').then(function(resultado){
       
        if(resultado.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con tipos de formula', 200, {listar_tipo_formula:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){     
       console.log("err controller.listarTipoFormula ", err);    
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de de registrar la formula como todo pendiente
 * @fecha 26/08/2016
 */
DispensacionHc.prototype.guardarTodoPendiente = function(req, res){
 
    var that = this;
    var args = req.body.data;
   
    if (!args.realizar_entrega_formula) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {realizar_entrega_formula: []}));
        return;
    }
    
    if(!args.realizar_entrega_formula.evolucionId){
        res.send(G.utils.r(req.url, 'La evolucion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;                                      
    } 
    
    if(!args.realizar_entrega_formula.tipoFormula){
        res.send(G.utils.r(req.url, 'Debe seleccionar el tipo de formula', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    var farmacia ={empresa:req.session.user.empresa,centro_utilidad:req.session.user.centro_utilidad,bodega:req.session.user.bodega};
    var tipoFormula = args.realizar_entrega_formula.tipoFormula;
    var evolucionId = args.realizar_entrega_formula.evolucionId;
    var usuario = req.session.user.usuario_id;
    var tipoIdPaciente = args.realizar_entrega_formula.tipoIdPaciente;
    var pacienteId = args.realizar_entrega_formula.pacienteId;
    var parametrosGenerarDispensacion={evolucionId:evolucionId, tipoFormula:tipoFormula.tipo,usuario: usuario, farmacia:farmacia};
    var def = G.Q.defer();           
    var numeroFormula;
    var tipoFormulaEvolucion;
    that.e_dispensacion_hc.onNotificarTodoPendienteFormula({dispensacion: ''},'Guardando pendientes...', 201,usuario);          
    res.send(G.utils.r(req.url, 'Generando reportes...', 201, {dispensacion: 'pendiente'})); 
    
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarNumeroFormula',{evolucionId:evolucionId}).then(function(resultado){
        numeroFormula = resultado[0].formula_id;
        tipoFormulaEvolucion = resultado[0].tipo_formula;
        /**
         * +Descripcion Se valida antes de dejar la formula con todo los productos pendientes, que no existan productos
         *              en la tabla de temporales
         */
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1);
          
      }).then(function(resultado){
        
        if(resultado.length > 0){
            
            throw 'La formula no puede quedar -Todo pendiente- por que contiene temporales';
          
        }else{
            
            return G.Q.ninvoke(that.m_dispensacion_hc, 'actualizarEstadoFormula',parametrosGenerarDispensacion); 
            
        }
     
    }).then(function(resultado){
        
        if(resultado.rowCount === 0){
             
           throw 'Error al actualizar el estado de la formula';  
            
        }else{           
           
           /*
            *+Descripcion Metodo encargado de almacenar los productos de la formula
            *             en estado --Todo pendiente-- 
            */
            return G.Q.ninvoke(that.m_dispensacion_hc, 'guardarTodoPendiente',parametrosGenerarDispensacion);
           
        }  
        
    }).then(function(resultado){
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucionId,numeroEntregaActual:1});
             
    }).then(function(resultado){ 
                            
        if(resultado[0].numeroentrega === 0 && resultado[0].sw_pendiente === 2 || tipoFormulaEvolucion === '0'){
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarTipoFormula',{evolucionId:evolucionId, tipoFormula:tipoFormula.tipo});  
        }else{
                     
            def.resolve();             
        }
                    
    }).then(function(resultado){
        
        
        that.e_dispensacion_hc.onNotificarTodoPendienteFormula({dispensacion: numeroFormula, 
            evolucionId:evolucionId,
            tipoIdPaciente: tipoIdPaciente,
            pacienteId: pacienteId},'La formula ha quedado con todos sus medicamentos pendientes',200,usuario); 
 
    }).fail(function(err){
       console.log("err [controller.guardarTodoPendiente]:", err); 
       that.e_dispensacion_hc.onNotificarTodoPendienteFormula({dispensacion: numeroFormula, 
            evolucionId:evolucionId,
            tipoIdPaciente: tipoIdPaciente,
            pacienteId: pacienteId},"Error al generar la formula como Todo pendiente. Formula # "+numeroFormula,500,usuario);

    }).done();
};

/**
 * @author Cristian Ardila
 * +Descripcion Controlador encargado de generar la dispensacion total de una
 *              formula, ejecutando en cascada los procesos pertinentes
 *              en el siguiente orden
 *  1) se ejecuta el model listarFormulas para obtener el plan id
 *  2) se ejecuta el model estadoParametrizacionReformular para obtener el valor
 *     de la variable de parametrizacion para formular
 *  3) se ejecuta el model estadoParametrizacionReformular para obtener el bodegas_doc_id
 *  4) se ejecuta el model consultarProductoTemporal para obtener los productos
 *     listos para ser dispensados
 *  5) se ejecuta el model bloquearTabla encargado de que la numeracion de la tabla
 *     bodegas_doc_numeraciones sea consistente y no se troque con una transaccion al tiempo
 *  6) se ejecuta el model asignacionNumeroDocumentoDespacho y se actualiza la numeracion
 *     segun el bodegas_doc_id enviado
 *  7) se ejecuta el model generarDispensacionFormula el cual ejecutara los siguientes procesos
 *      a traves de transacciones para que haya consistencia de datos, y si uno de los procesos
 *      falla se realizara un rollback
 *      (a)__insertarBodegasDocumentos se inserta la cabecera del despacho 
 *      (b)__insertarDespachoMedicamentos se inserta el documento generado
 *  8) se ejecuta la funcion privada recursiva __insertarBodegasDocumentosDetalle encargada
 *     de recorrer el arreglo con los productos preparados para dispensar
 *     (*)se ejecuta el model insertarBodegasDocumentosDetalle el cual ejecutara los siguientes procesos
 *      a traves de transacciones para que haya consistencia de datos, y si uno de los procesos
 *      falla se realizara un rollback
 *       (a)__actualizarExistenciasBodegasLotesFv se actualiza la existencias del lote
 *       (b)__actualizarExistenciasBodegas se actualiza las existencias de bodega
 *       (c)__insertarBodegasDocumentosDetalle se almacenan los productos dispensados
 *  9) se ejecuta el model consultarProductoTemporal para obtener los productos temporales
 *     y validar la cantidad pendiente que se dejo
 *  10) se ejecuta el model listarMedicamentosPendientes para listar los medicamentos pendientes
 *  11) se ejecuta la funcion privada recursiva __insertarMedicamentosPendientes encargada
 *      de recorrer el arreglo con los productos que quedan pendientes
 *      (a) se ejecuta el model insertarPendientesPorDispensar para almacenar lo que queda
 *      pendiente por dispensar
 *  12) se ejecuta el model eliminarTemporalesDispensados el cual eliminara los temporales
 *      de la formula actualmente dispensada 
 *  13) se ejecuta el model actualizarTipoFormula el cual actualizara el tipo 
 *      de la formula actualmente dispensada y con esto se termina el proceso de realizarEntregaFormula
 */
DispensacionHc.prototype.realizarEntregaFormula = function(req, res){
    
    var that = this;
    var args = req.body.data;   
   
    if(!args.realizar_entrega_formula){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.variable){
        res.send(G.utils.r(req.url, 'La variable de parametrizacion de formulacion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.evolucionId){
        res.send(G.utils.r(req.url, 'La evolucion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.tipoFormula){
        res.send(G.utils.r(req.url, 'Debe seleccionar el tipo de formula', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(args.realizar_entrega_formula.tipoEstadoFormula === '1'){
        res.send(G.utils.r(req.url, 'La formula se encuentra vencida', 404, {realizar_entrega_formula: []}));
        return;   
    }
    
    if(args.realizar_entrega_formula.tipoEstadoFormula === '2'){
        res.send(G.utils.r(req.url, 'Faltan dias para la entrega', 404, {realizar_entrega_formula: []}));
        return;   
    }
    
    if(args.realizar_entrega_formula.tipoEstadoFormula === '3'){
        res.send(G.utils.r(req.url, 'El tratamiento ya finalizo', 404, {realizar_entrega_formula: []}));
        return;   
    }
     
    var evolucionId = args.realizar_entrega_formula.evolucionId;
    var empresa = args.realizar_entrega_formula.empresa;
    var bodega = args.realizar_entrega_formula.bodega;
    var variable = args.realizar_entrega_formula.variable;
    var observacion = args.realizar_entrega_formula.observacion;
    var usuario = req.session.user.usuario_id;
    var tipoFormula = args.realizar_entrega_formula.tipoFormula;
    var tipoIdPaciente = args.realizar_entrega_formula.tipoIdPaciente;
    var pacienteId = args.realizar_entrega_formula.pacienteId;       
    var bodegasDocId;
    var planId;
    var variableParametrizacion;
    var numeracion;
    var temporales;
    var numeroFormula;   
    //Variables para calcular la fecha maxima de entrega de una formula
    var formato = 'YYYY-MM-DD';
    var now = new Date(); 
    var fechaEntrega;
    var fechaMinima;
    var actualizarFechaUltimaEntrega;
    var def = G.Q.defer();
    var tipoFormulaEvolucion;         
    var parametrosReformular = {variable: variable,terminoBusqueda: evolucionId,
                                filtro: {tipo:'EV'},empresa: empresa,bodega: bodega,
                                observacion: observacion,tipoVariable : 0,usuarioId : usuario};
    var tmp  = {};
                              
   
    that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: ''},'Dispensacion en proceso...', 201,usuario);
    res.send(G.utils.r(req.url, 'Generando reportes...', 201, {dispensacion: 'pendiente'}));

    //G.logError("===================> Inicia normal "  + evolucionId  + " " + tipoIdPaciente + " " + pacienteId + " *** usuario " + usuario + " empresa " + empresa + " bodega " + bodega);
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarNumeroFormula',{evolucionId:evolucionId}).then(function(resultado){

        numeroFormula = resultado[0].formula_id;
        tipoFormulaEvolucion = resultado[0].tipo_formula;
        return G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametrosReformular);
        
    }).then(function(resultado){
        
        if(resultado.length > 0){
           planId =  resultado[0].plan_id;
            return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametrosReformular);
        }else{
            throw 'Consulta sin resultados ';
        }
        
    }).then(function(resultado){
             
        if(resultado.length > 0){           
            var parametroBodegaDocId = {variable:"documento_dispensacion_"+empresa+"_"+bodega, tipoVariable:1, modulo:'Dispensacion' };
                variableParametrizacion = resultado[0].valor;
            /**
             *+Descripcion Se consulta el bodegas_doc_id correspondiente
             */
            return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId);
        }else{           
            throw 'Variable reformular no se encontro';            
        }
            
    }).then(function(resultado){
        
        if(resultado.length > 0){           
           bodegasDocId = resultado[0].valor;          
           return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1);          
        }else{
            throw 'El id del documento de bodega no se encuentra parametrizado';
        }
            
    }).then(function(resultado){
  
        if(resultado.length > 0){
           temporales = resultado;
          
           return G.Q.ninvoke(that.m_dispensacion_hc,'bloquearTabla');            
        }else{
            throw 'No hay temporales separados';
        }
           
    }).then(function(resultado){            
            return G.Q.ninvoke(that.m_dispensacion_hc,'asignacionNumeroDocumentoDespacho',{bodegasDocId:bodegasDocId});            
    }).then(function(resultado){     
          
        numeracion = resultado[0];    
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucionId,numeroEntregaActual:0});   
            
    }).then(function(resultado){
        
        if(resultado[0].numeroentrega === 1){
             
           actualizarFechaUltimaEntrega = 1;
        }else{
           actualizarFechaUltimaEntrega = 0;  
            
        }
        fechaEntrega = G.moment(now).add(30, 'day').format(formato);
        fechaMinima  = G.moment(now).add(25, 'day').format(formato);           
        return G.Q.nfcall(__calcularMaximaFechaEntregaFormula,{fecha_base:fechaEntrega,dias_vigencia:3}); 
            
    }).then(function(resultado){
        
        if(temporales.length > 0){
            
            var parametrosGenerarDispensacion=
                {
                    parametro1:{ bodegasDocId:bodegasDocId, 
                        numeracion:numeracion, 
                        observacion:observacion, 
                        estadoPendiente:0,
                        usuario: usuario,
                        evolucion: evolucionId,
                        todoPendiente: 0,
                        fechaEntrega: fechaEntrega, 
                        fechaMinima:fechaMinima, 
                        fechaMaxima:resultado.fechaMaxima,
                        actualizarFechaUltimaEntrega: actualizarFechaUltimaEntrega   
                    },

                    parametro2:{
                        temporales: temporales, 
                        usuario:usuario, 
                        bodegasDocId:bodegasDocId, 
                        numeracion:numeracion, 
                        planId: planId
                    }

                };
             
            /**
             * Inserta bodegas_documentos
             * Inserta hc_formulacion_despachos_medicamentos
             * Actualiza existencias_bodegas_lotes_fv, 
             * Actualiza existencias_bodegas
             * Inserta   bodegas_documentos_d
             * Inserta   hc_pendientes_por_dispensar
             * Consulta  hc_dispensacion_medicamentos_tmp
             * Consulta  Medicamentos pendientes
             * elimina   hc_dispensacion_medicamentos_tmp
             */        
            return G.Q.ninvoke(that.m_dispensacion_hc,'generarDispensacionFormula',parametrosGenerarDispensacion);
            
        }else{
            throw 'No se genero la dispensacion';    
                                              
        }
        
    }).then(function(resultado){
         
        /**
         * +Descripcion Se valida si la formula despues de dispensada se encuentra con productos pendientes
         *              
         */
        return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesSinDispensar',{evolucionId:evolucionId});
        
    
    }).then(function(resultado){
        var farmacia;
        var conPendientesEstado;
        if(resultado.length === 0){
            conPendientesEstado = 0;
            tmp.generoPendientes = 0;
        }else{
            farmacia ={ empresa:req.session.user.empresa, centro_utilidad:req.session.user.centro_utilidad, bodega:req.session.user.bodega};
            conPendientesEstado = 1;
            tmp.generoPendientes = 1;
        }
        G.knex.transaction(function(transaccion) { 
            
            /**
            * +Descripcion se actualiza la tabla de estados evidenciando
            *              que la formula ya no tiene pendientes
            */          
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarDispensacionEstados', {actualizarCampoPendiente:1, conPendientes:conPendientesEstado, evolucion:evolucionId , farmacia:farmacia},transaccion);
         
        });  
    }).then(function(resultado){
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucionId,numeroEntregaActual:1});   
        
    }).then(function(resultado){ 
       
        if(resultado[0].numeroentrega === 1 || tipoFormulaEvolucion === '0'){
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarTipoFormula',{evolucionId:evolucionId, tipoFormula:tipoFormula.tipo});  
        }else{
            def.resolve();             
        }
                   
    }).then(function(resultado){    
            
         that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: numeroFormula, 
                                                          evolucionId:evolucionId,
                                                          tipoIdPaciente: tipoIdPaciente,
                                                          pacienteId: pacienteId,
                                                      generoPendientes:  tmp.generoPendientes},'Se realiza la dispensacion correctamente',
                                                          200,
                                                          usuario);   
        
    }).fail(function(err){
        //G.logError("========================> ERROR normal"  + evolucionId  + " " +tipoIdPaciente+" "+ pacienteId +"*************************************");
        //console.log("err [Controller.realizarEntregaFormula]: ", err);
        that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: err, 
                                                          evolucionId:numeroFormula,
                                                          tipoIdPaciente: tipoIdPaciente,
                                                          pacienteId: pacienteId},err + " Formula # "+ numeroFormula,
                                                          500,
                                                          usuario);
    }).done(function(){
        //G.logError("========================> Finaliza normal"  + evolucionId  + " " +tipoIdPaciente+" "+ pacienteId +"*************************************");
    });    
};






function __calcularMaximaFechaEntregaFormula(obj, callback){
    var url =  G.constants.WS().DISPENSACION_HC.FECHA_MAXIMA ;
    var resultado;
 
    obj.parametros = {
        fecha_base:obj.fecha_base,
        dias_vigencia:obj.dias_vigencia
      
    };
    obj.error = false;

    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).
    then(function(client) {
        
        return G.Q.ninvoke(client, "SumarDiasHabiles", obj.parametros);
    }).
    spread(function(result,raw,soapHeader){

        if(!result.return.msj["$value"]){
            throw {msj:"Se ha generado un error", status:403, obj:{}}; 
        } else {            
            obj.fechaMaxima = result.return.msj["$value"];
          
        }
        
    }).then(function(){
        
        callback(false, obj);    
        
    }).fail(function(err) {    
        
        obj.error = true;
        obj.tipo = '0';
        console.log("err ", err);
        callback(err);
       
    }).done();
}


function __obtener_dias_habiles(fecha_base, dias_vigencia, callback) {
     
    var execPhp = require('exec-php');
    execPhp('/var/www/CalculoFechas.class.php', function(error, php, outprint) {
        
        php.obtenerdiashabiles(fecha_base, dias_vigencia, function(err, result, output, printed) {
           
            callback(false, result);
        });
    });
};
 
function __sumarDiasHabiles(that, fecha_base, dias_vigencia,callback) {
     
    var parametros = {fecha: fecha_base, operacion: '+', dias: dias_vigencia};
    var fechaMaximaI;
     
    G.Q.ninvoke(that.m_dispensacion_hc, 'intervalo_fecha', parametros).then(function(fechaMaximaIs) {
     
        fechaMaximaI = fechaMaximaIs[0].fecha;
        return G.Q.nfcall(__obtener_dias_habiles, fecha_base, fechaMaximaI);

    }).then(function(cantidad_dias_habiles) {
       
        return G.Q.nfcall(__fechaMaximaI,1, cantidad_dias_habiles, dias_vigencia, fechaMaximaI, fecha_base);

    }).then(function(fechaMaximaI) {
        
        callback(false, {fechaMaxima:fechaMaximaI});

    }).fail(function(err) {   
        
        console.log("ERROR [__sumarDiasHabiles]: ", err);
        callback(err);
    }).done();
};

function __fechaMaximaI(index,cantidad_dias_habiles, dias_vigencia, fechaMaximaI, fecha_base, callback) {

    if(index === cantidad_dias_habiles){
        callback(false, fechaMaximaI);
        return;      
    }                                 
    index++;
    var fecha = [];
    fecha = fechaMaximaI.split("-");
    fechaMaximaI = fecha[0] + '-' + fecha[1] + '-' + fecha[2];
    G.Q.nfcall(__obtener_dias_habiles, fecha_base, fechaMaximaI).then(function(respuesta) {
            
        var dia=('0'+(parseInt(fecha[2]) + 1)).slice(-2);
 
        fechaMaximaI = fecha[0] + '-' + fecha[1] + '-' + dia;

        setTimeout(function() {

            __fechaMaximaI(index,respuesta, dias_vigencia, fechaMaximaI, fecha_base, callback);
        }, 0);
        
    });
    
};


/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador autorizar una dispensacion de un medicamento en caso
 *              de este ser confrontado
 *              
 */
DispensacionHc.prototype.descartarProductoPendiente  = function(req, res){

    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    var def = G.Q.defer();         
    if (args.realizar_descarate_producto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {realizar_descarate_producto: []}));
        return;
    }
   
    if (!args.realizar_descarate_producto.identificadorProductoPendiente || args.realizar_descarate_producto.identificadorProductoPendiente.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere identificador del producto pendiente', 404, {realizar_descarate_producto: []}));
        return;
    }
    
    if (!args.realizar_descarate_producto.tipoJustificacion || args.realizar_descarate_producto.tipoJustificacion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de justificacion', 404, {realizar_descarate_producto: []}));
        return;
    }
    
    if (!args.realizar_descarate_producto.evolucion || args.realizar_descarate_producto.evolucion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {realizar_descarate_producto: []}));
        return;
    }
    
    
    var parametros={identificadorProductoPendiente:args.realizar_descarate_producto.identificadorProductoPendiente, 
            usuario:usuario, 
            tipoJustificacion: args.realizar_descarate_producto.tipoJustificacion,
            evolucion: args.realizar_descarate_producto.evolucion
        };
      
    G.Q.ninvoke(that.m_dispensacion_hc,'descartarProductoPendiente',parametros).then(function(resultado){
       
        if(resultado === 0){                                          
            throw {msj:'No se descarto el pendiente',status:403};
        }else{
            
            return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesSinDispensar',{evolucionId:parametros.evolucion});                                   
            //se cambio porque al descartar  un pendiente cambiaba el estado de la formula y no permitia dispensar los demas pendientes.
            //return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductosTodoPendiente', {evolucionId:parametros.evolucion, estado:0} );
              
        }            
        
   }).then(function(resultado){
        if(resultado.length === 0){
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarEstadoFormulaSinPendientes', {evolucion:parametros.evolucion, estado:0} );            
        }else{  
            def.resolve();
        }
         
   }).then(function(resultado){
      
      res.send(G.utils.r(req.url, 'Se descarta el producto satisfactoriamente', 200, {realizar_descarate_producto:[]}));       
      
   }).fail(function(err){   
       
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
      
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};


DispensacionHc.prototype.realizarEntregaFormulaPendientes = function(req, res){
         
   
    var that = this;
    var args = req.body.data;   
   
    if(!args.realizar_entrega_formula){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.variable){
        res.send(G.utils.r(req.url, 'La variable de parametrizacion de formulacion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.evolucionId){
        res.send(G.utils.r(req.url, 'La evolucion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.tipoFormula){
        res.send(G.utils.r(req.url, 'Debe seleccionar el tipo de formula', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    var evolucionId = args.realizar_entrega_formula.evolucionId;
    var empresa = args.realizar_entrega_formula.empresa;
    var bodega = args.realizar_entrega_formula.bodega;
    var variable = args.realizar_entrega_formula.variable;
    var observacion = args.realizar_entrega_formula.observacion;
    var usuario = req.session.user.usuario_id;
    var tipoFormula = args.realizar_entrega_formula.tipoFormula;
    var tipoIdPaciente = args.realizar_entrega_formula.tipoIdPaciente;
    var pacienteId = args.realizar_entrega_formula.pacienteId;
    var bodegasDocId;
    var planId;
    var variableParametrizacion;
    var numeracion;
    var temporales;
    var numeroFormula;
    
    //Variables para calcular la fecha maxima de entrega de una formula
    var formato = 'YYYY-MM-DD';
    var now = new Date(); 
    var fechaEntrega;
    var fechaMinima;
    var actualizarFechaUltimaEntrega;
    var def = G.Q.defer();
    var parametrosReformular = {variable: variable,terminoBusqueda: evolucionId,
                                filtro: {tipo:'EV'},empresa: empresa,bodega: bodega,
                                observacion: observacion,tipoVariable : 0,usuarioId : usuario};                             
    var bodegasDocTodoPendiente;                           
    that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: ''},'Dispensacion en proceso...', 201,usuario);          
    res.send(G.utils.r(req.url, 'Generando reportes...', 201, {dispensacion: 'pendiente'}));  
    var tipoFormulaEvolucion;
    var tmp = {
    };
   

//G.logError("========================> Inicia pendiente "  + evolucionId  + " " +tipoIdPaciente+" "+ pacienteId +"*************************************");
   G.Q.ninvoke(that.m_dispensacion_hc,'consultarNumeroFormula',{evolucionId:evolucionId}).then(function(resultado){
        
        numeroFormula = resultado[0].formula_id;
        tipoFormulaEvolucion = resultado[0].tipo_formula;
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductosTodoPendiente',{evolucionId:evolucionId, estado: 1});
              
               
   }).then(function(resultado){
        
        if(resultado.length > 0){        
           bodegasDocTodoPendiente = 1;                   
        }else{
           bodegasDocTodoPendiente = 0;              
        };
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametrosReformular);
       
     }).then(function(resultado){
        
        if(resultado.length > 0){
           planId =  resultado[0].plan_id;
           return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametrosReformular);
        }else{
            throw 'Consulta sin resultados ';
        }
        
       
    }).then(function(resultado){
        
        if(resultado.length > 0){           
            var parametroBodegaDocId = {variable:"documento_dispensacion_"+empresa+"_"+bodega, tipoVariable:1, modulo:'Dispensacion' };
                variableParametrizacion = resultado[0].valor;
            
            return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId);
        }else{           
            throw 'Variable reformular no se encontro';            
        }
            
    }).then(function(resultado){
         
        if(resultado.length > 0){           
           bodegasDocId = resultado[0].valor;   
           
           return G.Q.ninvoke(that.m_dispensacion_hc,'bloquearTabla'); 
                   
        }else{
            throw 'La variable de reformular no se encuentra parametrizada';
        }
    
    }).then(function(resultado){  
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'asignacionNumeroDocumentoDespacho',{bodegasDocId:bodegasDocId});     
        
    }).then(function(resultado){
          
           numeracion = resultado[0];    
           return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1);  
        
    }).then(function(resultado){
        temporales = resultado;
       
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucionId,numeroEntregaActual:0});   
       
    }).then(function(resultado){
        
        if(resultado[0].numeroentrega === 1){
             
           actualizarFechaUltimaEntrega = 1;
        }else{
           actualizarFechaUltimaEntrega = 0;  
            
        }
         
        //Variables para calcular la fecha maxima de entrega de una formula
        fechaEntrega = G.moment(now).add(30, 'day').format(formato);
        fechaMinima   = G.moment(now).add(25, 'day').format(formato);
         
        return G.Q.nfcall(__calcularMaximaFechaEntregaFormula,{fecha_base:fechaEntrega,dias_vigencia:3});
        
    }).then(function(resultado){
     
        if(temporales.length > 0){
            
            
            var parametrosGenerarDispensacion=
                {
                  parametro1:{ bodegasDocId:bodegasDocId, 
                   numeracion:numeracion, 
                   observacion:observacion, 
                   estadoPendiente:0,
                   usuario: usuario,
                   evolucion: evolucionId,
                   todoPendiente: bodegasDocTodoPendiente,
                   fechaEntrega: fechaEntrega, 
                   fechaMinima:fechaMinima, 
                   fechaMaxima:resultado.fechaMaxima,
                   actualizarFechaUltimaEntrega: actualizarFechaUltimaEntrega
                  },

                  parametro2:{
                    temporales: temporales, 
                    usuario:usuario, 
                    bodegasDocId:bodegasDocId, 
                    numeracion:numeracion, 
                    planId: planId
                }
            };
          
            /**
             * Inserta bodegas_documentos
             * Inserta hc_formulacion_despachos_medicamentos
             * Actualiza existencias_bodegas_lotes_fv, 
             * Actualiza existencias_bodegas
             * Inserta   bodegas_documentos_d
             * Inserta   hc_pendientes_por_dispensar
             * Consulta  hc_dispensacion_medicamentos_tmp
             * Consulta  Medicamentos pendientes
             * elimina   hc_dispensacion_medicamentos_tmp
             */        
            return G.Q.ninvoke(that.m_dispensacion_hc,'generarDispensacionFormulaPendientes',parametrosGenerarDispensacion);
            
        }else{
            throw 'No se genero la dispensacion';
        }
        
    }).then(function(){
        
        /**
         * +Descripcion Se valida si la formula despues de dispensada se encuentra con productos pendientes
         *              
         */
        return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesSinDispensar',{evolucionId:evolucionId});
        
    
    }).then(function(resultado){
           
        var conPendientesEstado;
        if(resultado.length === 0){
            conPendientesEstado = 0;
            tmp.generoPendientes = 0;
        }else{
            conPendientesEstado = 1;
            tmp.generoPendientes = 1;
        }  

        G.knex.transaction(function(transaccion) {  

           // if(resultado.rows.length === 0){
            /**
            * +Descripcion se actualiza la tabla de estados evidenciando
            *              que la formula ya no tiene pendientes
            */          
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarDispensacionEstados',{actualizarCampoPendiente:1, conPendientes:conPendientesEstado, evolucion:evolucionId},transaccion);

        });                    
            
    }).then(function(resultado){
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucionId,numeroEntregaActual:1});   
    }).then(function(resultado){ 
         
         if(resultado[0].numeroentrega === 1 && resultado[0].sw_pendiente === 2 || tipoFormulaEvolucion === '0'){
            return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarTipoFormula',{evolucionId:evolucionId, tipoFormula:tipoFormula.tipo});  
        }else{
            def.resolve();
        }
                      
    }).then(function(resultado){    
        
        that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: numeroFormula, 
                                                          evolucionId:evolucionId,
                                                          tipoIdPaciente: tipoIdPaciente,
                                                          pacienteId: pacienteId,
                                                          generoPendientes:  tmp.generoPendientes
                                                      },'Se realiza la dispensacion correctamente',

                                                          200,
                                                          usuario);   
         
    }).fail(function(err){ 
    //G.logError("========================> ERROR pendiente "  + evolucionId  + " " +tipoIdPaciente+" "+ pacienteId +"*************************************");
        that.e_dispensacion_hc.onNotificarEntregaFormula({dispensacion: err, 
            evolucionId:numeroFormula,
            tipoIdPaciente: tipoIdPaciente,
            pacienteId: pacienteId},
            err + " Formula # "+ numeroFormula,
            500,
            usuario
        );
    }).done(function(){
        //G.logError("========================> Finaliza pendiente"  + evolucionId  + " " +tipoIdPaciente+" "+ pacienteId +"*************************************");
    }); 
};

/*
 * @author Cristian Ardila
 * @fecha 03/08/2016
 * +Descripcion Controlador encargado de registrar el evento de entrega de 
 *              medicamentos pendientes
 *              
 */
DispensacionHc.prototype.registrarEvento = function(req, res){

    var that = this;
    var args = req.body.data;                  
    var usuario = req.session.user.usuario_id;
    
    
    if (args.registrar_evento === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {registrar_evento: []}));
        return;
    }
   
    if (!args.registrar_evento.evolucionId || args.registrar_evento.evolucionId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {registrar_evento: []}));
        return;
    }
    
    if (!args.registrar_evento.pacienteId || args.registrar_evento.pacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el documento del paciente', 404, {registrar_evento: []}));
        return;
    }
    
    if (!args.registrar_evento.tipoIdPaciente || args.registrar_evento.tipoIdPaciente.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento', 404, {registrar_evento: []}));
        return;
    }
       
    if (!args.registrar_evento.fecha || args.registrar_evento.fecha.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha', 404, {registrar_evento: []}));
        return;
    } 
    
    if (!args.registrar_evento.observacion || args.registrar_evento.observacion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {registrar_evento: []}));
        return;
    } 
    
    var parametros = {evolucionId:args.registrar_evento.evolucionId,
            tipoIdPaciente: args.registrar_evento.tipoIdPaciente,
            pacienteId: args.registrar_evento.pacienteId,
            fecha: args.registrar_evento.fecha,
            observacion: args.registrar_evento.observacion,
            usuario: usuario
        };
          
    G.Q.ninvoke(that.m_dispensacion_hc,'registrarEvento',parametros).then(function(resultado){
   
        res.send(G.utils.r(req.url, 'Evento registrado satisfactoriamente', 200, {registrar_evento: {}}));  
     
     }).fail(function(err){            
        res.send(G.utils.r(req.url, err.msj, 500, {}));
    }).done(); 
};


/*
 * @author Cristian Ardila
 * @fecha 26/09/2016
 * +Descripcion Controlador encargado de consultar los registros de los eventos 
 */
DispensacionHc.prototype.listarRegistroDeEventos = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (!args.registrar_evento) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_registro_eventos: []}));
        return;
    }
    
    if (!args.registrar_evento.evolucion || args.registrar_evento.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {registrar_evento: []}));
        return;
    }
    
    var parametros = {evolucion:args.registrar_evento.evolucion};
                 
    G.Q.ninvoke(that.m_dispensacion_hc,'listarRegistroDeEventos',parametros).then(function(resultado){
       
        if(resultado.length > 0){ 
              res.send(G.utils.r(req.url, 'lista de registros de eventos', 200, {listar_registro_eventos:resultado}));
        }else{
           throw 'No hay eventos registrados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};




/*
 * @author Cristian Ardila
 * @fecha 26/09/2016
 * +Descripcion Controlador encargado de consultar la cabecera de la formula
 */
DispensacionHc.prototype.obtenerCabeceraFormula = function(req, res){
    
    var that = this;
    var args = req.body.data;
   
    if (!args.cabecera_formula) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {cabecera_formula: []}));
        return;
    }
    
    if (!args.cabecera_formula.evolucion || args.cabecera_formula.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {cabecera_formula: []}));
        return;
    }
    var usuario = req.session.user.usuario_id;
    var parametros = {evolucionId:args.cabecera_formula.evolucion};
    
    that.e_dispensacion_hc.onNotificarCabeceraFormula({cabecera_formula:''},'Dispensacion en proceso...', 201,usuario);          
    res.send(G.utils.r(req.url, 'Generando reportes...', 201, {dispensacion: 'pendiente'})); 
                  
    G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormula',parametros).then(function(resultado){
       
        if(resultado.length > 0){
          that.e_dispensacion_hc.onNotificarCabeceraFormula({cabecera_formula:resultado},'Obteniendo cabecera',200,usuario);    
        }else{
           throw 'La cabecera de la formula no esta creada';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/*
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Controlador encargado listar los medicamentos pendientes
 *              por dispensar
 *              
 */
DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar = function(req, res){
   
    var that = this;
    var args = req.body.data;
  
    if (args.listar_medicamentos_pendientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_pendientes: []}));
        return;
    }
   
    if (!args.listar_medicamentos_pendientes.evolucion || args.listar_medicamentos_pendientes.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_pendientes: []}));
        return;
    }
   var productosPendientes;
   var detalleCabecera;
   var parametros = {evolucionId:args.listar_medicamentos_pendientes.evolucion,
        tipoIdPaciente: args.listar_medicamentos_pendientes.tipoIdPaciente,
        pacienteId: args.listar_medicamentos_pendientes.pacienteId,
        estadoEntrega: 1
    };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesPorDispensar',parametros).then(function(resultado){
         
        if(resultado.length > 0){             
            productosPendientes = resultado;          
            return G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormula',parametros);         
        }else{
           throw 'No hay pendientes por dispensar';
        }
      
   }).then(function(resultado){
       
       if(resultado.length > 0){ 
            
            detalleCabecera = resultado[0];
            return G.Q.ninvoke(that.m_dispensacion_hc,'profesionalFormula',parametros);
                
        }else{
            throw 'Consulta sin resultados';
        }
       
   }).then(function(resultado){
         
        if(resultado.length > 0){ 
            
            __generarPdf({productosPendientes:productosPendientes, 
                            serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                            detalle: detalleCabecera, 
                            profesional:resultado[0],
                            archivoHtml: 'medicamentosPendientesPorDispensar.html',
                            reporte: "Medicamentos_pendientes_por_dispensar_"}, function(nombre_pdf) {
                    
                    res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                    
                        listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultados: productosPendientes}
                    }));
                });
        }else{
            throw 'Consulta sin resultados';
        }
           
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Controlador encargado listar los medicamentos Dispensados
 *              
 */
DispensacionHc.prototype.listarMedicamentosDispensados = function(req, res){
   
    var that = this;
    var args = req.body.data;
  
    if (args.listar_medicamentos_dispensados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_dispensados.evolucion || args.listar_medicamentos_dispensados.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
   var productosDispensados;
   var profesional;
   var detalleCabecera;
   
   var parametros = {evolucionId:args.listar_medicamentos_dispensados.evolucion,
                    tipoIdPaciente: args.listar_medicamentos_dispensados.tipoIdPaciente,
                    pacienteId: args.listar_medicamentos_dispensados.pacienteId,
                    ultimo: 1,
                    estadoEntrega:0
                };
    
    var medicamentosDispensados = "";
    
    if(args.listar_medicamentos_dispensados.pendientes === 1){
        medicamentosDispensados = 'listarMedicamentosPendientesDispensados';
        
    }else{
        medicamentosDispensados = 'listarUltimaDispensacionFormula'; 
    }
   
    G.Q.ninvoke(that.m_dispensacion_hc,medicamentosDispensados,parametros).then(function(resultado){
        
        if(resultado.length > 0){ 
            
            if(resultado[0].tipo_entrega === '1'){
                 
                parametros.estadoEntrega = 2;
                
            }
            
            productosDispensados = resultado;
           
            return G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormula',parametros);
          
        }else{
           throw 'No hay pendientes por dispensar';
        }
      
   }).then(function(resultado){
      
       if(resultado.length > 0){ 
            
            detalleCabecera = resultado[0];
            return G.Q.ninvoke(that.m_dispensacion_hc,'profesionalFormula',parametros);
                
        }else{
            throw 'Consulta sin resultados';
        }
       
   }).then(function(resultado){
        
        if(resultado.length > 0){ 
            
             profesional = resultado;
              
            __generarPdf({productosDispensados:productosDispensados, 
                          serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                          detalle: detalleCabecera, 
                          profesional:profesional,
                          archivoHtml: 'medicamentosDispensados.html',
                          reporte: "Medicamentos_dispensados"
                          }, function(nombre_pdf) {
                     
                    res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                    
                        listar_medicamentos_dispensados: {nombre_pdf: nombre_pdf, resultado: productosDispensados}
                    }));
                    
                  });
        }else{
            throw 'Consulta sin resultados';
        }
           
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

 
/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo que consulta todas las dispensaciones de la formula
 * @fecha 20/09/2016 DD/MM/YYYY
 */
DispensacionHc.prototype.listarTotalDispensacionesFormula = function(req, res){
     
    var that = this;
    var args = req.body.data;
    
    
    if (args.listar_medicamentos_dispensados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_dispensados.evolucion || args.listar_medicamentos_dispensados.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
    
    
    var parametros = {evolucionId:args.listar_medicamentos_dispensados.evolucion};
    
    
    G.Q.ninvoke(that.m_dispensacion_hc, 'listarTodoMedicamentosDispensados', parametros).then(function(resultado){
        
        if(resultado.length > 0){ 
        
            res.send(G.utils.r(req.url, 'Evento registrado satisfactoriamente', 200, {listar_medicamentos_dispensados: resultado}));  
        }else{
            throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){
        console.log("err [listarTotalDispensacionesFormula]: ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
    
};

/*
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Controlador encargado listar los medicamentos Dispensados
 *              
 */      
DispensacionHc.prototype.listarTodoMedicamentosDispensados = function(req, res){
   
  
    var that = this;
    var args = req.body.data;
  
    if (args.listar_medicamentos_dispensados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_dispensados: []}));
        return;
    }                                      
   
    if (!args.listar_medicamentos_dispensados.evolucion || args.listar_medicamentos_dispensados.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
    
   var productosDispensados;
   var profesional;
   var productosDispensadosPendientes;
   var detalleCabecera;
   
    var parametros = {evolucionId:args.listar_medicamentos_dispensados.evolucion,
            tipoIdPaciente: args.listar_medicamentos_dispensados.tipoIdPaciente,
            pacienteId: args.listar_medicamentos_dispensados.pacienteId,
            ultimo: 1,
            estadoEntrega: 0
        };
         
    G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormula',parametros).then(function(resultado){
       
       if(resultado.length > 0){ 
            
            detalleCabecera = resultado[0];
            productosDispensados = args.lista_total_dispensaciones;
            return G.Q.ninvoke(that.m_dispensacion_hc,'profesionalFormula',parametros);
                
        }else{
            throw 'Consulta sin resultados';
        }
       
   }).then(function(resultado){
       
       if(resultado.length > 0){ 
            
            profesional = resultado;
            return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesDispensados',parametros);
       }else{
           
           throw 'Consulta sin resultados';
           
       }
       //
   }).then(function(resultado){                                      
           
        var parametrosPdf = {};
        if(resultado.length > 0){ 
            
            parametrosPdf = {productosDispensados:productosDispensados, 
                serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                detalle: detalleCabecera, 
                profesional:profesional,
                productosDispensadosPendientes:resultado,
                archivoHtml: 'medicamentosDispensadosTodo.html',
                reporte: "todo_dispensados"
            };
            
        }else{
            parametrosPdf = {productosDispensados:productosDispensados, 
                serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                detalle: detalleCabecera, 
                profesional:profesional,                           
                archivoHtml: 'medicamentosDispensadosTodo.html',
                reporte: "todo_dispensados"
            };
        }    
          
        __generarPdf(parametrosPdf, function(nombre_pdf) {

            res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{

                listar_medicamentos_dispensados: {nombre_pdf: nombre_pdf, resultado: productosDispensados}
            }));

        });
       
           
    }).fail(function(err){  
       console.log("err [listarTodoMedicamentosDispensados]: ", err);
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


function __generarPdf(datos, callback) {  
   
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/DispensacionHc/reports/'+datos.archivoHtml, 'utf8'),
            recipe: "html",
           // style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function(err, response) {
        
        response.body(function(body) {
           var fecha = new Date();
           var nombreTmp = datos.reporte + fecha.getTime() + ".html";
             
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                     console.log("err [__generarPdf]: ", err);
                } else {
                     
                    callback(nombreTmp);
                }
            });                            
        });
    });
}


/**
 * +Descripcion Proceso encargado de ajustar el numero de entrega
 * @author Cristian Ardila
 * @fecha 20/05/2016
 *              
 */
DispensacionHc.prototype.ajustarNumeroEntregaFormula = function(req, res){
     
    var that = this;
    var args = req.body.data;
    var formato = 'YYYY-MM-DD';
    var now = new Date(); 
    var fechaEntrega = G.moment(now).format(formato);                                       
    var fechaMinima  = G.moment(now).format(formato);              
    var opciones = "";
    if (!args.ajustar_numero_entrega_formula ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {ajustar_numero_entrega_formula: []}));
        return;
    }
     
    if (!args.ajustar_numero_entrega_formula.numero_entrega || 
            args.ajustar_numero_entrega_formula.numero_entrega === 0  
              ) {                                                                                    
        res.send(G.utils.r(req.url, 'El numero de entrega no puede estar vacio ni ser CERO (0)', 404, {}));
        return;
    }
     
    var parametrosPermisos = { usuario_id:req.session.user.usuario_id, empresa_id:req.session.user.empresa, modulos:['dispensar_formulas'], convertirJSON:true };
       
    
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:args.ajustar_numero_entrega_formula.evolucion
        ,numeroEntregaActual:1}).then(function(resultado){
            
        if(args.ajustar_numero_entrega_formula.numero_entrega >= resultado[0].numeroentrega && 
           args.ajustar_numero_entrega_formula.numero_entrega < resultado[0].numero_total_entregas){
            return G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametrosPermisos);
        }else{
            throw {state:404, msj:"El numero de entrega no debe ser menor al actual y no debe ser superior al total de entregas de la formula "};
        }
            
    }).then(function(parametrizacion){
      
      opciones=parametrizacion.modulosJson.dispensar_formulas.opciones;
       
        if(opciones.sw_ajustar_entrega_formula){
             
            return G.Q.nfcall(__calcularMaximaFechaEntregaFormula,{fecha_base:fechaEntrega,dias_vigencia:3});
        }else{
            throw {state:403, msj:"El usuario no tiene permisos para modificar"};
        } 
      
    }).then(function(resultado){   
         
        var parametros = {
            fechaEntrega: fechaEntrega, 
            fechaMinima:fechaMinima, 
            fechaMaxima:resultado.fechaMaxima,
            numeroEntrega: args.ajustar_numero_entrega_formula.numero_entrega,
            evolucionId: args.ajustar_numero_entrega_formula.evolucion
        };
          
        return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarFechaMinimaMaxima',parametros);
           
    }).then(function(resultado){
        
            return res.send(G.utils.r(req.url, 'Se realiza el ajuste satisfactoriamente', 200, {ajustar_numero_entrega_formula:resultado}));
       
    }).fail(function(err){      
         console.log("err [ajustarNumeroEntregaFormula]: ", err);
       res.send(G.utils.r(req.url, err.msj, err.state, {}));
    }).done();
};


DispensacionHc.prototype.insertarFormulasDispensacionEstadosAutomatico = function(req, res){
    
    var that = this;
    var args = req.body.data;
    
    if (!args.insertar_formulas_dispensacion_estados_automatico ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {ajustar_numero_entrega_formula: []}));
        return;
    }
      
    G.Q.ninvoke(that.m_dispensacion_hc, "listarEvoluciones").then(function(resultado){
        
        return G.Q.nfcall(__insertarEvoluciones,that, 0, resultado);
        
    }).then(function(resultado){
        
    }).fail(function(error){
        
    }).done();
    
    
};
 
function __insertarEvoluciones(that, index, evoluciones, callback){
     
    var evolucion = evoluciones[index];
   
    if(!evolucion){
        
        callback(false);
        
        return;
    }
    index++;  
     
    var parametros={ evolucionId: evolucion.evolucion_id,filtro: {tipo: 'EV', descripcion: 'Evolucion'}}; 
    
    var formato = 'YYYY-MM-DD';
    var fechaEntrega;
    var fechaMinima;
    var fechaMaxima;
    var fechaFormulacion;
    var fechaUltimaEntrega;
    var estadoFinalizacionFormula;
    
   G.Q.ninvoke(that.m_dispensacion_hc,'consultarFormulaAntecedentes',parametros).then(function(resultado){   
              
       if(resultado.length > 0){
            fechaFormulacion = resultado[0].fecha_formulacion;
             return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:evolucion.evolucion_id,numeroEntregaActual:1});
           
        }else{
            throw 'La formula no existe';
        }
     
    }).then(function(resultado){
         
        if(resultado.length > 0){
            throw 'La formula ya ha sido generada';
                         
        }else{
            //
            return  G.Q.ninvoke(that.m_dispensacion_hc,'consultarDispensacionesFormula', { evolucionId: evolucion.evolucion_id,filtro: {tipo: 'EV', descripcion: 'Evolucion'}});
        }
         
    }).then(function(resultado){ 
         
        if(resultado.length > 0){
              fechaUltimaEntrega = resultado[0].fecha_entrega;
              estadoFinalizacionFormula = resultado[0].sw_finalizado;
            if(resultado[0].fecha_entrega === null ){  
                
                fechaEntrega = fechaFormulacion;  
                fechaMinima  = fechaFormulacion; 
            }else{         
                
                if(resultado[0].sw_finalizado === 1){
                    fechaEntrega = fechaFormulacion;   
                    fechaMinima  = fechaFormulacion; 
                }else{
                    fechaEntrega = G.moment(resultado[0].fecha_entrega).add(30, 'day').format(formato);  
                    fechaMinima   = G.moment(resultado[0].fecha_entrega).add(25,'days').format(formato);
                }
                
            }
       
        return G.Q.nfcall(__calcularMaximaFechaEntregaFormula,{fecha_base:fechaEntrega,dias_vigencia:3}); 
           
        }else{                            
           throw 'Error al almacenar la formula';
        }  
    }) .then(function(resultado){
             
            if(fechaUltimaEntrega === null ){  
                
                fechaMaxima = resultado.fechaMaxima; 
                
            }else{         
                
                if(estadoFinalizacionFormula === 1){
                    fechaMaxima = fechaFormulacion; 
                    
                }else{
                    fechaMaxima = resultado.fechaMaxima; 
                }
                
            }
        var parametrosFechaMinimaMaxima={evolucionId:evolucion.evolucion_id,
               fechaEntrega:fechaEntrega, 
               fechaMinima:fechaMinima, 
               fechaMaxima:fechaMaxima,
               numeroEntrega: 0
            };
         
        return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarFechaMinimaMaxima', parametrosFechaMinimaMaxima);
        
    }).then(function(resultado){
         
       setTimeout(function() {
        __insertarEvoluciones(that, index, evoluciones, callback);
       }, 0);
      
    }) .fail(function(err){  
        console.log("err [insertarFormulasDispensacionEstados]: ", err);    
       
       setTimeout(function() {
        __insertarEvoluciones(that, index, evoluciones, callback);
        }, 0);
    }).done();
   
}
 
/**
 * +Descripcion Proceso de migracion a la tabla dispensacion_estados
 *
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar los tipos de documentos
 *              
 */  
DispensacionHc.prototype.insertarFormulasDispensacionEstados = function(req, res){
     
    var that = this;
    var args = req.body.data;
    
    if (!args.insertar_formulas_dispensacion_estados ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
    
    
    if (!args.insertar_formulas_dispensacion_estados.filtro || !args.insertar_formulas_dispensacion_estados.filtro.tipo === 'EV' ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    if (!args.insertar_formulas_dispensacion_estados.terminoBusqueda || args.insertar_formulas_dispensacion_estados.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, 'Debe diligenciar el termino de busqueda', 404, {}));
        return;
    }
     
    var terminoBusqueda = args.insertar_formulas_dispensacion_estados.terminoBusqueda;
    var filtro = args.insertar_formulas_dispensacion_estados.filtro;
    
    var parametros={filtro: filtro};
       
    var formato = 'YYYY-MM-DD';
    var fechaEntrega;
    var fechaMinima;
    var fechaMaxima;
    var fechaFormulacion;
    var fechaUltimaEntrega;
    var estadoFinalizacionFormula;
     
    G.Q.ninvoke(that.m_dispensacion_hc, "consultarEvolucionFormula",{terminoBusqueda:terminoBusqueda, filtro: filtro}).then(function(resultado){
       
        if(resultado.length > 0){
            parametros.evolucionId = resultado[0].evolucion_id;
        }else{
              throw 'La formula no existe';
        }
        return  G.Q.ninvoke(that.m_dispensacion_hc,'consultarFormulaAntecedentes',parametros);
    
    }).then(function(resultado){
      
        if(resultado.length > 0){
            fechaFormulacion = resultado[0].fecha_formulacion;
             return G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimaEntregaFormula',{evolucion:parametros.evolucionId,numeroEntregaActual:1});

        }else{
            throw 'La formula no existe';
        }
            
    }).then(function(resultado){
     
        if(resultado.length > 0){
            throw 'La formula ya ha sido generada';
                         
        }else{
           return  G.Q.ninvoke(that.m_dispensacion_hc,'consultarDispensacionesFormula', parametros);
        }
         
    }).then(function(resultado){ 
       
           
        if(resultado.length > 0){
              fechaUltimaEntrega = resultado[0].fecha_entrega; 
              estadoFinalizacionFormula = resultado[0].sw_finalizado;
            
            /**
             * +Descripcion Si la fecha entrega llega null es por que la formula
             *              no tiene ninguna entrega por lo cual no se le adicionaran
             *              dias para la proxima entrega
             */
            if(resultado[0].fecha_entrega === null ){   
                
                fechaEntrega = fechaFormulacion;  
                fechaMinima  = fechaFormulacion; 
            }else{         
                
                /**
                * +Descripcion Si formula tiene estado finalizado no se le adicionaran
                *              dias para la proxima entrega
                */
                if(resultado[0].sw_finalizado === 1){
                    fechaEntrega = fechaFormulacion;   
                    fechaMinima  = fechaFormulacion; 
                }else{
                    
                    /**
                     * +Descripcion Estado: (resultado[0].estado_fecha_refrendacion)
                     *              1. Si la fecha de la refrendacion de la formula
                     *              es >= a la ultima entrega de la formula o a la
                     *              fecha de registro de la formula
                     *              2. Si la fecha de la refrendacion de la formula
                     *              es < a la ultima entrega de la formula o a la
                     *              fecha de registro de la formula
                     *              Si el estado es 1 = no se le adicionaran dias
                     *              para la proxima entrega
                     *              si el estado es 0 Se valida 
                     *              
                     */
                    if(resultado[0].estado_fecha_refrendacion === 1){
                        
                        fechaEntrega = fechaUltimaEntrega;   
                        fechaMinima  = fechaUltimaEntrega;
                        
                    }else{
                        
                       /**
                         * +Descripcion si la formula no registra entregas no se le adicionaran dias
                         *              para la proxima entrega 
                         *              de lo contrario si se le adicionaran dias
                         *              para la proxima entrega               
                         **/
                        if(resultado[0].numero_entrega_actual === 0){
                            fechaEntrega = resultado[0].fecha_registro;   
                            fechaMinima  = resultado[0].fecha_registro;  
                        }else{
                        
                        fechaEntrega = G.moment(resultado[0].fecha_entrega).add(30, 'day').format(formato);  
                        fechaMinima   = G.moment(resultado[0].fecha_entrega).add(25,'days').format(formato);
                        
                        }
                    }                   
                }                
            }
            
            return G.Q.nfcall(__calcularMaximaFechaEntregaFormula,{fecha_base:fechaEntrega,dias_vigencia:3}); 
           
        }else{                            
           throw 'Error al almacenar la formula';
        }
        
    }) .then(function(resultado){
 
 
        if(fechaUltimaEntrega === null ){  

            fechaMaxima = resultado.fechaMaxima; 

        }else{         

            if(estadoFinalizacionFormula === 1){
                fechaMaxima = fechaFormulacion; 

            }else{
                fechaMaxima = resultado.fechaMaxima; 
            }

        }
        var parametrosFechaMinimaMaxima={evolucionId:parametros.evolucionId,
            fechaEntrega:fechaEntrega, 
            fechaMinima:fechaMinima, 
            fechaMaxima:fechaMaxima,
            numeroEntrega: 0
        };
         
        return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarFechaMinimaMaxima', parametrosFechaMinimaMaxima);
        
    }).then(function(resultado){
     
       return res.send(G.utils.r(req.url, 'DATOS ALMACENADOS EXITOSAMENTE', 200, {insertar_formulas_dispensacion_estados:resultado.rows}));
       
    }).fail(function(err){  
        console.log("err [insertarFormulasDispensacionEstados]: ", err);    
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Cristian Manuel Ardila Troches
 * +Descripcion Metodo encargado de traer las formulas dispensadas de los ultimos
 *              50 dias de un paciente, se hayan entregado tanto por el modulo de 
 *              dispensacion HC (Histori Clinica) ó Formulacion Externa
 * @fecha 2016-12-03
 */
DispensacionHc.prototype.consultarMovimientoFormulasPaciente = function(req, res){

    var that = this;
    var args = req.body.data;
    var today = new Date();
    var formato = 'YYYY-MM-DD';
    var fechaExtTicinco=G.moment().subtract(50,'days').format(formato);
    var fechaToday = G.moment(today).format(formato);
     
    if(!args.consultar_movimiento_formula_paciente.pacienteId || args.consultar_movimiento_formula_paciente.pacienteId.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el documento del paciente', 404, {consultar_movimiento_formula_paciente: []}));
        return;
    }
    
    if(!args.consultar_movimiento_formula_paciente.tipoIdPaciente || args.consultar_movimiento_formula_paciente.tipoIdPaciente.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de documento del paciente', 404, {consultar_movimiento_formula_paciente: []}));
        return;
    }
    
    var parametros = {tipoIdPaciente: args.consultar_movimiento_formula_paciente.tipoIdPaciente, 
        pacienteId: args.consultar_movimiento_formula_paciente.pacienteId,
        fechaDia: fechaExtTicinco,
        today: fechaToday,
        movimientoFormulaPaciente: 0
    };
    
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimoRegistroDispensacion', parametros).then(function(resultado){
      
       return res.send(G.utils.r(req.url, 'Lista de formulas del paciente', 200, {consultar_movimiento_formula_paciente:resultado}));
       
    }).fail(function(err){
        
        res.send(G.utils.r(req.url, err.msj, err.codigo, {consultar_movimiento_formula_paciente:[]}));
    }).done();
    
};


DispensacionHc.$inject = ["m_dispensacion_hc", "e_dispensacion_hc", "m_usuarios", "e_dispensacion_hc","m_productos"];

module.exports = DispensacionHc;
