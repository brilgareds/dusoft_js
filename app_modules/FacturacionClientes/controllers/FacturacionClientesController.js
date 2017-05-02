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


FacturacionClientes.prototype.listarClientes = function(req, res){
   
    var that = this;
               
                 
    G.Q.ninvoke(that.m_facturacion_clientes,'listarClientes').then(function(resultado){
        
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
