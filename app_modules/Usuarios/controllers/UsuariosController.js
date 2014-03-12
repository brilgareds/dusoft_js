
var Usuarios = function(usuarios) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;
};



Usuarios.prototype.listarUsuarios = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    if (args.lista_usuarios.termino_busqueda === undefined || args.lista_usuarios.estado_registro === undefined){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = args.lista_usuarios.termino_busqueda;
    var estado_registro = args.lista_usuarios.estado_registro;


    this.m_usuarios.listar_usuarios_sistema(termino_busqueda, estado_registro, function(err, lista_usuarios) {
        res.send(G.utils.r(req.url, 'Lista Usuarios Sistema', 200, {lista_usuarios: lista_usuarios}));
    });
};


Usuarios.$inject = ["m_usuarios"];

module.exports = Usuarios;