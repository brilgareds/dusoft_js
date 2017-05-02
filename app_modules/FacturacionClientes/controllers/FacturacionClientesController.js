var FacturacionClientes = function(m_facturacion_clientes) {
    this.m_facturacion_clientes = m_facturacion_clientes;
    /* m_facturacion_clientes, e_facturacion_clientes, m_usuarios
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.e_facturacion_clientes = e_facturacion_clientes;
    this.m_usuarios = m_usuarios;*/
   
};

/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar la lista de formulas
 *              
 */
FacturacionClientes.prototype.listarTiposTerceros = function(req, res){
     
    console.log("********FacturacionClientes.prototype.listarClientes *********************");
    var that = this;
    var args = req.body.data;
    
    /*if (args.listar_formulas === undefined || args.listar_formulas.paginaActual === undefined) {
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
                    usuarioId : usuario};*/
                
                 
    G.Q.ninvoke(that.m_facturacion_clientes,'listarTiposTerceros').then(function(resultado){
         console.log("resultado :", resultado);
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
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
