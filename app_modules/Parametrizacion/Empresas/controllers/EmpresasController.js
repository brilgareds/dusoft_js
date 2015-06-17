
var Empresas = function(empresas) {

    console.log("Modulo Empresas Cargado ");

    this.m_empresas = empresas;
};


Empresas.prototype.listar_empresas = function(req, res) {
    
    var that = this;

    that.m_empresas.listar_empresas(function(err, lista_empresas){
        if(err){
            res.send(G.utils.r(req.url, 'Error listado empresas', 500, {empresas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
        }
    });
    
};


Empresas.prototype.listarEmpresasFarmacias = function(req, res) {
    
    var that = this;
    
    that.m_empresas.listarEmpresasFarmacias(function(err, lista_empresas){
        if(err){
            res.send(G.utils.r(req.url, 'Error listado empresas', 500, {empresas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
        }
    });
    
};

Empresas.prototype.listar_empresas_modulos = function(req, res) {
    
    var that = this;
    
    var args = req.body.data;

    var modulos_id = args.empresas.modulos_id;
    
    
    if (modulos_id === undefined && modulos_id.length === 0) {
        res.send(G.utils.r(req.url, 'El id del modulo no se encontro', 500, {empresas: {}}));
        return;
    }

    that.m_empresas.listar_empresas_modulos(modulos_id, function(err, lista_empresas){
        if(err){
            res.send(G.utils.r(req.url, 'Error listado empresas', 500, {empresas: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Empresas', 200, {empresas: lista_empresas}));
        }
    });
    
};



Empresas.$inject = ["m_empresas"];

module.exports = Empresas;