
var Departamentos = function(departamentos) {

    this.m_departamentos = departamentos;
};


Departamentos.prototype.listarDepartamentos = function(req, res) {

    var that = this;

    that.m_departamentos.listar_departamentos(function(err, lista_departamentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los departamentos', 500, {departamentos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de departamentos', 200, {departamentos: lista_departamentos}));
        }
    });
};

Departamentos.prototype.listarDepartamentosPais = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.departamentos === undefined || args.departamentos.pais_id === undefined ) {
        res.send(G.utils.r(req.url, 'pais_id no esta definido', 404, {}));
        return;
    }
    
    var pais_id = args.departamentos.pais_id;

    that.m_departamentos.listar_departamentos_pais(pais_id, function(err, lista_departamentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los departamentos', 500, {departamentos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de departamentos', 200, {departamentos: lista_departamentos}));
        }
    });
};

Departamentos.prototype.seleccionarDepartamento = function(req, res) {

    var that = this;


    var args = req.body.data;

    if (args.departamentos === undefined || args.departamentos.pais_id === undefined || args.departamentos.departamento_id === undefined) {
        res.send(G.utils.r(req.url, 'pais_id o departamento_id no están definidos', 404, {}));
        return;
    }
    
    var pais_id = args.departamentos.pais_id;
    var departamento_id = args.departamentos.departamento_id;

    that.m_departamentos.seleccionar_departamento(departamento_id, pais_id, function(err, lista_departamentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error consultando el departamento', 500, {departamentos: {}}));
        } else {
            res.send(G.utils.r(req.url, 'Consulta del departamento exitosa', 200, {departamentos: lista_departamentos}));
        }
    });
};

Departamentos.$inject = ["m_departamentos"];

module.exports = Departamentos;