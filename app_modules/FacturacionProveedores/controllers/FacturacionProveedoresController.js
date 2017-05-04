var FacturacionProveedores = function(m_facturacion_proveedores) {
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    /* m_facturacion_proveedores, e_facturacion_clientes, m_usuarios
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.e_facturacion_clientes = e_facturacion_clientes;
    this.m_usuarios = m_usuarios;*/
   
};



FacturacionProveedores.prototype.listarOrdenesCompraProveedor = function(req, res){
   
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
    console.log("parametros ", parametros)           
    G.Q.ninvoke(that.m_facturacion_proveedores,'consultarOrdenesCompraProveedor',parametros).then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listarOrdenesCompraProveedor:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

FacturacionProveedores.$inject = ["m_facturacion_proveedores"];
//, "e_facturacion_clientes", "m_usuarios"
module.exports = FacturacionProveedores;
