var Rotacion = function (rotacion, m_usuarios) {
    this.m_rotacion = rotacion;
    this.m_usuarios = m_usuarios;
};

Rotacion.prototype.listarRotacion = function (req, res) {
    var that = this;
    var args = req.body.data;
    
    G.Q.ninvoke(that.m_rotacion, "listarRotacion",args).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'listar rotacion ok!!!', 200, {listarRotacion: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar rotacion', 500, {listarRotacion: {}}));
            }).
            done();
};

//ELMINAR ROTACION
Rotacion.prototype.eliminarRotacion = function (req, res){
    var that = this;
    var args = req.body.data;
    var parametros = {
        id_registro: args.id_registro
    };
    G.Q.ninvoke(that.m_rotacion, "eliminarRotacion", parametros).then(function (resultado) {
    })
    .then(function (resultado) {
        res.send(G.utils.r(req.url, 'Rotación eliminada correctamente !!!!', 200, {eliminarRotacion: resultado}));
    })
    .fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al eliminar rotación', 500, {eliminarRotacion: {}}));
    }).
    done();
};


//listarempresas 
Rotacion.prototype.listarEmpresas = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.ninvoke(that.m_rotacion, "listarEmpresas").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'listar Empresas ok!!!', 200, {listarEmpresas: resultado}));
            }).fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar Empresas', 500, {listarEmpresas: {}}));
            }).done();
};

//listarFarmacias 
Rotacion.prototype.listarFarmacias = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.ninvoke(that.m_rotacion, "listarFarmacias").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'listar farmacias ok!!!', 200, {listarFarmacias: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar Farmacias', 500, {listarFarmacias: {}}));
            }).
            done();
};

//listarFarmacias 
Rotacion.prototype.listarZonas = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.ninvoke(that.m_rotacion, "listarZonas").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'listar zonas ok!!!', 200, {listarZonas: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar zonas', 500, {listarZonas: {}}));
            }).
            done();
};


Rotacion.prototype.guardarRotacion = function (req, res) {
    var that = this;
    var args = req.body.data;
    if (args.empresa_id === undefined || args.empresa_id === "") {
        res.send(G.utils.r(req.url, 'Debe digitar la empresa de la rotacion', 404, {}));
        return;
    }
    if (args.bodega_id === undefined || args.bodega_id === "") {
        res.send(G.utils.r(req.url, 'Debe digitar la farmacia de la rotacion', 404, {}));
        return;
    }
    if (args.zonas_id === undefined || args.zonas_id === "") {
        res.send(G.utils.r(req.url, 'Debe digitar la zona de la rotacion', 404, {}));
        return;
    }
    if (args.fecha_rotacion === undefined || args.fecha_rotacion === "") {
        res.send(G.utils.r(req.url, 'Debe digitar la fecha de la rotacion', 404, {}));
        return;
    }
    G.Q.ninvoke(that.m_rotacion, "rotacion", args).then(function (resultado) {
        res.send(G.utils.r(req.url, 'rotacion ok!!!!', 200, {rotacion: resultado}));
    }).fail(function (err) {
        console.log("guardarRotacion::",err);
        res.send(G.utils.r(req.url, 'Error de rotacion', 500, {rotacion: {error: err}}));
    }).done();
};


Rotacion.prototype.modificarRotacion = function (req, res) {
    var that = this;
    var args = req.body.data;
    G.Q.ninvoke(that.m_rotacion, "modificarRotacion", args).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Modificar rotacion ok!!!!', 200, {rotacion: resultado}));
    }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al modificar la rotacion', 500, {rotacion: {error: err}}));
    }).done();

};


Rotacion.$inject = [
    "m_rotacion",
    "m_usuarios"
];
module.exports = Rotacion;
