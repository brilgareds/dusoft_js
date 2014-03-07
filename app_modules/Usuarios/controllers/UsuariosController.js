
var Usuarios = function(usuarios) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;
};



Usuarios.prototype.listarUsuarios = function(req, res) {
    var that = this;

    var termino_busqueda = (req.query.termino_busqueda === undefined) ? '' : req.query.termino_busqueda;
    var estado_registro = (req.query.estado_registro === undefined) ? '' : req.query.estado_registro;

    this.m_usuarios.listar_usuarios_sistema(termino_busqueda, estado_registro, function(err, lista_usuarios) {
        res.send(G.utils.r(req.url, 'Lista Usuarios Sistema', 200, {lista_usuarios: lista_usuarios}));
    });
};


Usuarios.$inject = ["m_usuarios"];

module.exports = Usuarios;