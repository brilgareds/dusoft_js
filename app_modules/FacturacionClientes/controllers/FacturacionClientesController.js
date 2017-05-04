var FacturacionClientes = function(m_facturacion_clientes) {
    this.m_facturacion_clientes = m_facturacion_clientes;
    /* m_facturacion_clientes, e_facturacion_clientes, m_usuarios
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.e_facturacion_clientes = e_facturacion_clientes;
    this.m_usuarios = m_usuarios;*/
   
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
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_tipo_terceros:resultado}));
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
   
   

                
   /* var parametros2 = {empresaId:empresaId,
        numero:numero,
        prefijo:prefijo,
        tipoIdTercero:filtro.tipo,
        pedidoClienteId:'',
        terceroId:terminoBusqueda,
        nombreTercero:'',
        paginaActual: paginaActual,
        usuario: usuario
    };*/
    
   
    var parametros = {
        empresaId:empresaId,
        numero:numero,
        prefijo:'',
        tipoIdTercero:filtro.tipo,
        pedidoClienteId:'',
        terceroId: terminoBusqueda,
        nombreTercero: ' ',//nombreTercero,
        paginaActual:paginaActual
    };       
     console.log("parametros2 ", parametros)
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

FacturacionClientes.$inject = ["m_facturacion_clientes"];
//, "e_facturacion_clientes", "m_usuarios"
module.exports = FacturacionClientes;
