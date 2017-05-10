var FacturacionClientes = function(m_facturacion_clientes,m_dispensacion_hc) {
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_dispensacion_hc = m_dispensacion_hc;
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
    var tipoIdTercero = args.listar_pedidos_clientes.tipoIdTercero;
    var terceroId = args.listar_pedidos_clientes.terceroId;
    var paginaActual = args.listar_pedidos_clientes.paginaActual;
    var parametros = {
        empresaId: args.listar_pedidos_clientes.empresaId,
        tipoIdTercero:tipoIdTercero,
        terceroId:terceroId,
        pedidoClienteId: terminoBusqueda,
        paginaActual: paginaActual
    };
    
    var listaPedidosClientes;
    var listaPrefijos;
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
        
        console.log("resultado [transaccionGenerarFacturasAgrupadas]: ", resultado);
        
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
    
    console.log("PEDIDOS DOCUMENTOS FACTURAR ", args.generar_factura_individual.documentos.pedidos[0])
    /*var usuario = req.session.user.usuario_id;
    var parametros = {
        empresaId: args.generar_factura_individual.empresaId,
        tipoIdTercero: args.generar_factura_individual.tipoIdTercero,
        terceroId: args.generar_factura_individual.terceroId,
        documentoId:'',
        estado:1,
        tipoPago: args.generar_factura_individual.tipoPago,
        usuario:usuario,
        direccion_ip: '',
        pedido: args.generar_factura_individual.documentos
    };    
    var parametroBodegaDocId = {variable:"documento_factura_"+parametros.empresaId, tipoVariable:1, modulo:'FacturasDespacho' };    
    var documentoFacturacion;
    var consultarTerceroContrato;
    var consultarParametrosRetencion;
    var def = G.Q.defer(); 
    
    
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
        //console.log("resultado [listarPrefijosFacturas]: ", resultado);
        if(resultado.length >0){
            return G.Q.ninvoke(that.m_facturacion_clientes,'consultarTerceroContrato',parametros);
        }else{
            throw {msj:'[listarPrefijosFacturas]: Consulta sin resultados', status: 404}; 
        }
        
    }).then(function(resultado){
        
        console.log("resultado [consultarTerceroContrato]: ", resultado);
        consultarTerceroContrato = resultado;
        //console.log("resultado [consultarTerceroContrato]: ", resultado);
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
            throw {msj:'Se ha generado un error (Duplicate-key) Al crear la factura ['+ documentoFacturacion[0].id +"-" + documentoFacturacion[0].numeracion+"]", status: 409};                       
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
        
        console.log("resultado [transaccionGenerarFacturasAgrupadas]: ", resultado);
        
    }).fail(function(err){  
        
        console.log("err ", err);
        if(!err.status){
            err = {};
            err.status = 500;
            err.msj = "Se ha generado un error..";
        }
       res.send(G.utils.r(req.url, err.msj, err.status, {}));
    }).done();*/
    
}
FacturacionClientes.$inject = ["m_facturacion_clientes","m_dispensacion_hc"];
//, "e_facturacion_clientes", "m_usuarios"
module.exports = FacturacionClientes;
