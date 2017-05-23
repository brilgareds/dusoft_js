var FacturacionClientes = function(m_facturacion_clientes,m_dispensacion_hc,m_e008,m_usuarios,m_sincronizacion) {
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_dispensacion_hc = m_dispensacion_hc;
    this.m_e008 = m_e008;
    this.m_usuarios = m_usuarios;
    this.m_sincronizacion = m_sincronizacion;
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los tipos de terceros
 *              
 */
FacturacionClientes.prototype.listarTiposTerceros = function(req, res){
   
    var that = this;
               
                 
    G.Q.ninvoke(that.m_facturacion_clientes,'listarTiposTerceros').then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta lista tipos terceros', 200, {listar_tipo_terceros:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los prefijos
 *              
 */
FacturacionClientes.prototype.listarPrefijosFacturas = function(req, res){
   
    var that = this;
    var args = req.body.data;           
    
    if (args.listar_prefijos === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_prefijos: []}));
        return;
    }
    
    if (args.listar_prefijos.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_prefijos: []}));
        return;
    }
    
    var parametros = {
        empresaId:args.listar_prefijos.empresaId,
        estado:0
    }
    G.Q.ninvoke(that.m_facturacion_clientes,'listarPrefijosFacturas',parametros).then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta lista de prefijos', 200, {listar_prefijos:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar las facturas generadas
 *              
 */
FacturacionClientes.prototype.listarFacturasGeneradas = function(req, res){
   
    var that = this;
    var args = req.body.data;
    
    if (args.listar_facturas_generadas === undefined || args.listar_facturas_generadas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_facturas_generadas: []}));
        return;
    }
     
    if (args.listar_facturas_generadas.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_facturas_generadas: []}));
        return;
    }

    if (args.listar_facturas_generadas.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_facturas_generadas: []}));
        return;
    }
    
    if (!args.listar_facturas_generadas.filtro ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
     
    var empresaId = args.listar_facturas_generadas.empresaId;
    var terminoBusqueda = args.listar_facturas_generadas.terminoBusqueda;
    var paginaActual = args.listar_facturas_generadas.paginaActual;
    var filtro = args.listar_facturas_generadas.filtro;
    var prefijo = args.listar_facturas_generadas.prefijo;
    var numero = args.listar_facturas_generadas.numero;
    var usuario = req.session.user.usuario_id;
    var nombreTercero = args.listar_facturas_generadas.nombreTercero;
    
   
    var parametros = {
        empresaId:empresaId,
        numero:numero,
        prefijo:prefijo.tipo,
        tipoIdTercero:filtro.tipo,
        pedidoClienteId:'',
        terceroId: terminoBusqueda,
        nombreTercero: nombreTercero,//nombreTercero,
        paginaActual:paginaActual
    };       
     
    G.Q.ninvoke(that.m_facturacion_clientes,'listarFacturasGeneradas',parametros).then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_facturas_generadas:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
FacturacionClientes.prototype.listarClientes = function(req, res){
   
    var that = this;
    var args = req.body.data;
    
    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_clientes: []}));
        return;
    }
     
    if (args.listar_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_clientes: []}));
        return;
    }

    if (args.listar_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_clientes: []}));
        return;
    }
    
    if (!args.listar_clientes.filtro ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    
    
    var empresaId = args.listar_clientes.empresaId;
    var terminoBusqueda = args.listar_clientes.terminoBusqueda;
    var paginaActual = args.listar_clientes.paginaActual;
    var filtro = args.listar_clientes.filtro;
    var usuario = req.session.user.usuario_id;
   
   
   var parametros={ empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    filtro: filtro,
                    usuarioId : usuario};
             
    G.Q.ninvoke(that.m_facturacion_clientes,'listarClientes',parametros).then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_clientes:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los pedidos de los clientes 
 *              que se van a facturar
 *              
 */
FacturacionClientes.prototype.listarPedidosClientes = function(req, res){
    
    var that = this;
    var args = req.body.data;           
    
    if (args.listar_pedidos_clientes === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_pedidos_clientes: []}));
        return;
    }
    
    if (args.listar_pedidos_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_pedidos_clientes: []}));
        return;
    }
    
    if (args.listar_pedidos_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {listar_clientes: []}));
        return;
    }
    
    
    var terminoBusqueda = args.listar_pedidos_clientes.terminoBusqueda;
    var pedidoMultipleFarmacia = args.listar_pedidos_clientes.pedidoMultipleFarmacia;
    var tipoIdTercero = args.listar_pedidos_clientes.tipoIdTercero;
    var terceroId = args.listar_pedidos_clientes.terceroId;
    var paginaActual = args.listar_pedidos_clientes.paginaActual;
    var parametros = {
        empresaId: args.listar_pedidos_clientes.empresaId,
        tipoIdTercero:tipoIdTercero,
        terceroId:terceroId,
        pedidoClienteId: terminoBusqueda,
        paginaActual: paginaActual,
        pedidoMultipleFarmacia: pedidoMultipleFarmacia
    };
    
    var listaPedidosClientes;
 
    G.Q.ninvoke(that.m_facturacion_clientes,'listarPedidosClientes',parametros).then(function(resultado){
       
       
      console.log("resultado [listarPedidosClientes]: ", resultado.length)
        if(resultado.length >0){
            listaPedidosClientes = resultado;
            return G.Q.nfcall(__listarDocumentosPedidos,that,0, resultado,parametros.empresaId,[]);

        }else{
            throw 'El cliente no tiene pedidos para facturar';
        }
        
    }).then(function(resultado){
        
        if(resultado.length >0){
            
            return res.send(G.utils.r(req.url, 'Consulta lista de pedidos clientes', 200, {listar_pedidos_clientes:listaPedidosClientes, lista_prefijos:resultado}));
        
        }else{
            throw 'El cliente no tiene pedidos para facturar';
        }
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


function __listarDocumentosPedidos(that, index, pedidos,empresaId,documentos, callback) {
   //console.log("**********__listarDocumentosPedidos*****************");
    var pedido = pedidos[index];   
    
    if (!pedido) {       
         
        callback(false,documentos);  
        return;                     
    }  
    // console.log("pedido ", pedido)
    index++;
     G.Q.ninvoke(that.m_facturacion_clientes,'consultarDocumentosPedidos', {empresaId:empresaId,pedidoClienteId:pedido.pedido_cliente_id})
            .then(function(resultado){ 
                if(resultado.length > 0){
                    documentos.push(resultado);
            }
               
    }) .fail(function(err){ 
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);            
    }).done(); 
    
    
    setTimeout(function() {
            __listarDocumentosPedidos(that, index, pedidos,empresaId,documentos, callback);
    }, 300);
   
};
/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los terceros
 *              
 */
FacturacionClientes.prototype.generarFacturasAgrupadas = function(req, res){
   
   console.log("************FacturacionClientes.prototype.generarFacturasAgrupadas***************");
   console.log("************FacturacionClientes.prototype.generarFacturasAgrupadas***************");
   console.log("************FacturacionClientes.prototype.generarFacturasAgrupadas***************");
   
    var that = this;
    var args = req.body.data;    
    /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   
    console.log("ip [connection]: ", ip)
    if (args.generar_factura_agrupada === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {generar_factura_agrupada: []}));
        return;
    }
    
    if (args.generar_factura_agrupada.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {generar_factura_agrupada: []}));
        return;
    }
    
    if (args.generar_factura_agrupada.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_agrupada: []}));
        return;
    }
    
    if (args.generar_factura_agrupada.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_agrupada: []}));
        return;
    }
    
    if (args.generar_factura_agrupada.documentos === undefined || args.generar_factura_agrupada.documentos.length < 2) {
        res.send(G.utils.r(req.url, 'Debe seleccionar los pedidos', 404, {generar_factura_agrupada: []}));
        return;
    }
    
    var usuario = req.session.user.usuario_id;
    var parametros = {
        empresaId: args.generar_factura_agrupada.empresaId,
        tipoIdTercero: args.generar_factura_agrupada.tipoIdTercero,
        terceroId: args.generar_factura_agrupada.terceroId,
        documentoId:'',
        estado:1,
        tipoPago: args.generar_factura_agrupada.tipoPago,
        usuario:usuario,
        direccion_ip: '',
        pedidos: args.generar_factura_agrupada.documentos
    };
    
    var parametroBodegaDocId = {variable:"documento_factura_"+parametros.empresaId, tipoVariable:1, modulo:'FacturasDespacho' };
    
    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;
    var def = G.Q.defer(); 
    G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId).then(function(resultado){
        
        parametros.documentoId = resultado[0].valor;
    
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'listarPrefijosFacturas',parametros)
        }else{
            throw {msj:'[estadoParametrizacionReformular]: Consulta sin resultados', status: 404}; 
        }
         
        
    }).then(function(resultado){
        documentoFacturacion = resultado;
        //console.log("resultado [listarPrefijosFacturas]: ", resultado);
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarTerceroContrato',parametros);
        }else{
            throw {msj:'[listarPrefijosFacturas]: Consulta sin resultados', status: 404}; 
        }
        
    }).then(function(resultado){
        consultarTerceroContrato = resultado;
        //console.log("resultado [consultarTerceroContrato]: ", resultado);
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarParametrosRetencion',parametros);       
        }else{
            throw {msj:'[consultarTerceroContrato]: Consulta sin resultados', status: 404}; 
        }

    }).then(function(resultado){
        consultarParametrosRetencion = resultado;   
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarFacturaAgrupada',documentoFacturacion[0]);       
        }else{
            throw {msj:'[consultarParametrosRetencion]: Consulta sin resultados', status: 404}; 
        }

    }).then(function(resultado){  
        console.log("resultado [consultarParametrosRetencion]: ",resultado)
        if(resultado.length > 0){
            
            throw {msj:'Se ha generado un error (Duplicate-key) Al crear la factura ['+ documentoFacturacion[0].id +"-" + documentoFacturacion[0].numeracion+"]", status: 409};   

        }else{           
            console.log("ip ", ip)
            if(ip.substr(0, 6) === '::ffff'){               
                return G.Q.ninvoke(that.m_facturacion_clientes,'consultarDireccionIp',{direccionIp:ip.substr(7, ip.length)});              
            }else{                
                def.resolve();                
            }              
        }
         
    }).then(function(resultado){
       
        if(!resultado || resultado.length > 0){
            parametros.direccion_ip = ip;
            return G.Q.ninvoke(that.m_facturacion_clientes,'transaccionGenerarFacturasAgrupadas',
            {documento_facturacion:documentoFacturacion,
             consultar_tercero_contrato:consultarTerceroContrato,
             consultar_parametros_retencion:consultarParametrosRetencion,
             parametros:parametros
             });
        }else{
            throw {msj:'La Ip #'+ ip.substr(7, ip.length) +' No tiene permisos para realizar la peticion', status: 409}; 
        }
            
    }).then(function(resultado){                              
          
        var parametros = [];
            parametros[0] = resultado.empresa_id;
            parametros[1] = resultado.id;
            parametros[2] = resultado.numeracion;
    
        var param = {param: parametros,funcion:'facturas_venta_fi'};
        console.log("param >>>>>>>>>>> ", param)
        return G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param);       
         
    }).then(function(resultado){
        
        console.log("resultado ", resultado);
        return res.send(G.utils.r(req.url, 'Se genera la factura satisfactoriamente', 200, 
        {generar_factura_agrupada:documentoFacturacion,
        resultado_sincronizacion_ws: resultado}));
        
    }).fail(function(err){  
        
        console.log("err ", err);
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 02/05/2017
 * +Descripcion Controlador encargado de listar los terceros
 *              
 */
FacturacionClientes.prototype.generarFacturaIndividual = function(req, res){
   
   console.log("************FacturacionClientes.prototype.generarFacturaIndividual***************");
   console.log("************FacturacionClientes.prototype.generarFacturaIndividual***************");
   console.log("************FacturacionClientes.prototype.generarFacturaIndividual***************");
   
    var that = this;
    var args = req.body.data;
    
     /**
     * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
     * @example '::ffff:10.0.2.158'
     */
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   
    
    if (args.generar_factura_individual === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {generar_factura_individual: []}));
        return;
    }
    
    if (args.generar_factura_individual.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {generar_factura_individual: []}));
        return;
    }
    
    if (args.generar_factura_individual.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_individual: []}));
        return;
    }
    
    if (args.generar_factura_individual.tipoPago === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el tipo de pago', 404, {generar_factura_individual: []}));
        return;
    }
    
    
    var usuario = req.session.user.usuario_id;
    var parametros = {
        empresaId: args.generar_factura_individual.empresaId,
        tipoIdTercero: args.generar_factura_individual.tipoIdTercero,
        terceroId: args.generar_factura_individual.terceroId,
        documentoId:'',
        estado:1,
        tipoPago: args.generar_factura_individual.tipoPago,
        usuario:usuario,
        direccion_ip: '',
        pedido: args.generar_factura_individual.pedido,
        documentos: args.generar_factura_individual.documentos,
        
    };    
    var parametroBodegaDocId = {variable:"documento_factura_"+parametros.empresaId, tipoVariable:1, modulo:'FacturasDespacho' };    
    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;
    var def = G.Q.defer(); 
    var parametrosSincronizacion = [];
   
    G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId).then(function(resultado){
        
        console.log("resultado [estadoParametrizacionReformular]: ", resultado);
        parametros.documentoId = resultado[0].valor;
    
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'listarPrefijosFacturas',parametros)
        }else{
            throw {msj:'[estadoParametrizacionReformular]: Consulta sin resultados', status: 404}; 
        }
         
        
    }).then(function(resultado){
        
        console.log("resultado [listarPrefijosFacturas]: ", resultado);
        documentoFacturacion = resultado;
      
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarTerceroContrato',parametros);
        }else{
            throw {msj:'[listarPrefijosFacturas]: Consulta sin resultados', status: 404}; 
        }
        
    }).then(function(resultado){
        
        console.log("resultado [consultarTerceroContrato]: ", resultado);
        consultarTerceroContrato = resultado;
        
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarParametrosRetencion',parametros);       
        }else{
            throw {msj:'[consultarTerceroContrato]: Consulta sin resultados', status: 404}; 
        }

    }).then(function(resultado){  

       
        consultarParametrosRetencion = resultado;
        
        if(resultado.length > 0){
            
            if(ip.substr(0, 6) === '::ffff'){               
                return G.Q.ninvoke(that.m_facturacion_clientes,'consultarDireccionIp',{direccionIp:ip.substr(7, ip.length)});              
            }else{                
                def.resolve();                
            } 
            
        }else{           
            
            throw {msj:'[consultarParametrosRetencion]: Consulta sin resultados', status: 404};    
            
        }
         
    }).then(function(resultado){
       
        if(!resultado || resultado.length > 0){
            parametros.direccion_ip = ip;
            return G.Q.ninvoke(that.m_facturacion_clientes,'transaccionGenerarFacturaIndividual',
            {documento_facturacion:documentoFacturacion,
             consultar_tercero_contrato:consultarTerceroContrato,
             consultar_parametros_retencion:consultarParametrosRetencion,
             parametros:parametros
             });                                                      
        }else{
            throw {msj:'La Ip #'+ ip.substr(7, ip.length) +' No tiene permisos para realizar la peticion', status: 409}; 
        }
            
    }).then(function(resultado){                              
          
        var parametros = [];
            parametros[0] = resultado.empresa_id;
            parametros[1] = resultado.prefijo;
            parametros[2] = resultado.numeracion;
    
        var param = {param: parametros,funcion:'facturas_venta_fi'};
        return G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param);       
         
    }).then(function(resultado){
        
        console.log("resultado ", resultado);
        return res.send(G.utils.r(req.url, 'Se genera la factura satisfactoriamente', 200, 
        {generar_factura_individual:documentoFacturacion,
        resultado_sincronizacion_ws: resultado}));
        
    }).fail(function(err){  
         
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done(); 
    
};

FacturacionClientes.prototype.sincronizarFactura = function(req, res){
    
    console.log("**************FacturacionClientes.prototype.sincronizarFactura***********************");
    console.log("**************FacturacionClientes.prototype.sincronizarFactura***********************");
    console.log("**************FacturacionClientes.prototype.sincronizarFactura***********************");
    
    var that = this;
    var args = req.body.data;
    
    /**
    * +Descripcion Variable encargada de capturar la ip del cliente que se conecta
    * @example '::ffff:10.0.2.158'
    */
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   
    //console.log("args ", args);
    if (args.sincronizar_factura === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {sincronizar_factura: []}));
        return;
    }
    
    if (args.sincronizar_factura.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {sincronizar_factura: []}));
        return;
    }
    
    if (args.sincronizar_factura.factura_fiscal === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de factura', 404, {sincronizar_factura: []}));
        return;
    }
    
    var parametros = {
        empresaId: args.sincronizar_factura.empresa_id,  
        documentoId:''
    };    
    
    var parametroBodegaDocId = {variable:"documento_factura_"+args.sincronizar_factura.empresa_id, tipoVariable:1, modulo:'FacturasDespacho' };    
   
    G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId).then(function(resultado){
        
        //console.log("resultado [estadoParametrizacionReformular]: ", resultado);
        parametros.documentoId = resultado[0].valor;
    
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'listarPrefijosFacturas',parametros)
        }else{
            throw {msj:'[estadoParametrizacionReformular]: Consulta sin resultados', status: 404}; 
        }
         
        
    }).then(function(resultado){
        
        //console.log("resultado [listarPrefijosFacturas]: ", resultado);
        var parametrosSincronizar = [];
        parametrosSincronizar[0] = resultado[0].empresa_id;
        parametrosSincronizar[1] = resultado[0].id;
        parametrosSincronizar[2] = args.sincronizar_factura.factura_fiscal ;
        var param = {param: parametrosSincronizar,funcion:'facturas_venta_fi'};
        
        return G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param);
        
    }).then(function(resultado){
        console.log("resultado [sincronizarCuentasXpagarFi]::: ", resultado)
        return res.send(G.utils.r(req.url, 'Se genera la factura satisfactoriamente', 200, {resultado_sincronizacion_ws: resultado}));
        
    }).fail(function(err){  
         
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();
    /*
    console.log("param >>>>>>>>>>> ", param)
    G.Q.ninvoke(that.m_sincronizacion,"sincronizarCuentasXpagarFi", param).then(function(resultado){
        console.log("resultado ", resultado);
        
     }).fail(function(err){  
         
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done(); */
}

 
function numeroLetra(valor)
{    
    var n = parseFloat(valor).toFixed(2); /*se limita a dos decimales, no sabía que existía toFixed() :)*/
    var p = n.toString().substring(n.toString().indexOf(".") + 1); /*decimales*/
    var t = "";
    t = numeroDecimalLetra(n);
   
    if(p){
         console.log("p [numeroLetra]::: ", p);
        t += " con " + (p == 00 ? 'cero ' : numeroDecimalLetra(p)) ;
        console.log("t ", t)
    }
    /*correcciones*/
    t = t.replace("  ", " ");
    //t = t.replace(" cero", "");
  
    return t;
}

function numeroDecimalLetra(n)
{
    var o=new Array("diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve");
    var u=new Array("cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve");
    var d=new Array("", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa");
    var c=new Array("", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos");
    var n = parseFloat(n).toFixed(2); /*se limita a dos decimales, no sabía que existía toFixed() :)*/
    var m = n.toString().substring(0, n.toString().indexOf(".")); /*número sin decimales*/
    var m = parseFloat(m).toString().split("").reverse(); /*tampoco que reverse() existía :D*/
    var t = "";

    /*Se analiza cada 3 dígitos*/
    for (var i = 0; i < m.length; i += 3)
    {
        var x = t;
        /*formamos un número de 2 dígitos*/
        var b = m[i + 1] != undefined ? parseFloat(m[i + 1].toString() + m[i].toString()) : parseFloat(m[i].toString());
        /*analizamos el 3 dígito*/
        t = m[i + 2] != undefined ? (c[m[i + 2]] + " ") : "";
        t += b < 10 ? u[b] : (b < 30 ? o[b - 10] : (d[m[i + 1]] + (m[i] == '0' ? "" : (" y " + u[m[i]]))));
        t = t == "ciento cero" ? "cien" : t;
        if (2 < i && i < 6)
            t = t == "uno" ? "mil " : (t.replace("uno", "un") + " mil ");
        if (5 < i && i < 9)
            t = t == "uno" ? "un millón " : (t.replace("uno", "un") + " millones ");
        t += x;
        //t=i<3?t:(i<6?((t=="uno"?"mil ":(t+" mil "))+x):((t=="uno"?"un millón ":(t+" millones "))+x));
    }
  
    return t;
}

function numberFormat(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');

    return amount_parts.join(',');
}
/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de generar el informe detallado de la factura  
 *              generada
 * @fecha 18/05/2017
 */
FacturacionClientes.prototype.consultaFacturaGeneradaDetalle = function (req, res) {

    console.log("************FacturacionClientesModel.prototype.consultaFacturaGeneradaDetalle *****************");
    console.log("************FacturacionClientesModel.prototype.consultaFacturaGeneradaDetalle *****************");
    console.log("************FacturacionClientesModel.prototype.consultaFacturaGeneradaDetalle *****************");

    var that = this;
    var args = req.body.data;
    var def = G.Q.defer(); 
    if (args.consulta_factura_generada_detalle === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_pendientes: []}));
        return;
    }
    
    var parametros = {
        empresa_id: args.consulta_factura_generada_detalle.cabecera.empresa_id,
        factura_fiscal: args.consulta_factura_generada_detalle.cabecera.factura_fiscal,
        prefijo: args.consulta_factura_generada_detalle.cabecera.prefijo
    };
    var usuario_id = req.session.user.usuario_id;
    var today = new Date();   
    var formato = 'YYYY-MM-DD hh:mm';
    var fechaToday = G.moment(today).format(formato);
    var parametrosReporte =  {
            cabecera: args.consulta_factura_generada_detalle.cabecera,           
            serverUrl: req.protocol + '://' + req.get('host') + "/",
            detalle: {},
            valores: {},
            imprimio:{usuario:'',fecha:fechaToday},
            archivoHtml: 'facturaGeneradaDetalle.html',
            reporte: "factura_generada_detalle_"
    };
    
    var retenciones = 0;
    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;    
    
    
   G.Q.ninvoke(that.m_usuarios, 'obtenerUsuarioPorId', usuario_id).then(function(resultado){
        
        if(resultado){ 
            parametrosReporte.imprimio.usuario = resultado.nombre;
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultaDetalleFacturaGenerada',parametros);
        }else{
            throw {msj:'[obtenerUsuarioPorId]: Consulta sin resultados', status: 404}; 
        }
        
   }).then(function(resultado){
                    
        if(resultado.length >0){                        
            parametrosReporte.detalle = resultado;
            if(parametrosReporte.cabecera.factura_agrupada === '1'){
                parametrosReporte.cabecera.pedido_cliente_id = '';
                return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarPedidosFacturaAgrupada', parametros);
            }else{
                def.resolve();
            }
        
        }else{
            throw {msj:'[estadoParametrizacionReformular]: Consulta sin resultados', status: 404}; 
        }
        
    }).then(function(resultado){
         
            if (resultado) {
                if (resultado.length > 0) {
                    var coma = ",";
                    var length = resultado.length-1;    
                    resultado.forEach(function (row, index) {

                        if (index === length) {
                            coma = "";
                        }
                        parametrosReporte.cabecera.pedido_cliente_id += row.pedido_cliente_id + coma;

                    });
 
                } else {
                    throw {msj: '[estadoParametrizacionReformular]: Consulta sin resultados', status: 404};
                }
            }else{
                def.resolve();
            }
            
    }).then(function(resultado){                      
        
        return G.Q.ninvoke(that.m_facturacion_clientes,'consultarParametrosRetencion',{empresaId: parametros.empresa_id});  
                                                     
                                                     
    }).then(function(resultado){ 
          
        if (resultado.length > 0) {
              
            parametrosReporte.detalle.forEach(function(row){              
                subTotal += parseFloat(row.subtotal_factura);
                totalIva += parseFloat(row.iva_total);
            }); 
             
             
            if(subTotal >= resultado[0].base_rtf){
                retencionFuente = (subTotal * ((parametrosReporte.cabecera.porcentaje_rtf) / 100));
            }
        
            if(subTotal >= resultado[0].base_ica){
                retencionIca = (subTotal) * (parseFloat(parametrosReporte.cabecera.porcentaje_ica) / 1000);
            }

            if(subTotal >= resultado[0].base_reteiva){
                retencionIva = (totalIva) * (parseFloat(parametrosReporte.cabecera.porcentaje_reteiva) / 100);
            }

            totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));
             
            parametrosReporte.valores.retencionFuente = numberFormat(retencionFuente,2);
            parametrosReporte.valores.retencionIca = numberFormat(retencionIca,2);
            parametrosReporte.valores.retencionIva = numberFormat(retencionIva,2);
            parametrosReporte.valores.ivaTotal = numberFormat(parseFloat(totalIva),2);
            parametrosReporte.valores.subTotal = numberFormat(parseFloat(subTotal),2);
            parametrosReporte.valores.totalFactura = numberFormat(parseFloat(totalFactura),2);
            parametrosReporte.valores.totalFacturaLetra = numeroLetra(totalFactura);
             
            return G.Q.nfcall(__generarPdf,parametrosReporte);
             
        }else{
             throw {msj:'[consultarParametrosRetencion]: Consulta sin resultados', status: 404};  
        }
        
    }).then(function(resultado){
        
        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {
                consulta_factura_generada_detalle: {nombre_pdf: resultado, resultados: {}}
        }));
        
    }).fail(function(err){  
         
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done(); 
};

/**
 * +Descripcion Funcion encargada de generar el reporte pdf en una plantilla
 *              html, procesando los datos enviados
 */
function __generarPdf(datos, callback) {  
    
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/FacturacionClientes/reports/'+datos.archivoHtml, 'utf8'),
            recipe: "html",
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
                     console.log("err [__generarPdf]: ", err)
                } else {
                     
                    callback(false,nombreTmp);
                }
            });
                
            
        });
    });
}           
             
             
FacturacionClientes.$inject = ["m_facturacion_clientes","m_dispensacion_hc", "m_e008","m_usuarios","m_sincronizacion"];
//, "e_facturacion_clientes", 
module.exports = FacturacionClientes;
