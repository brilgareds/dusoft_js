var ModuloModel = function() {

};


ModuloModel.prototype.listar_modulos = function(callback) {


    var sql = "SELECT * FROM modulos ORDER BY id ASC ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.obtenerModulosPorId = function(ids, callback) {

    var ids = ids.join(",");
    var sql = "SELECT * FROM modulos WHERE id in($1) ";

    G.db.query(sql, [ids], function(err, rows, result) {
        callback(err, rows);
    });
};

//gestiona para modificar o insertar el modulo
ModuloModel.prototype.guardarModulo = function(modulo, callback) {
    var self = this;

    if (modulo.modulo_id && modulo.modulo_id !== 0) {
        self.modificarModulo(modulo, function(err, rows) {
            callback(err, rows);
        });
    } else {
        self.insertarModulo(modulo, function(err, rows) {
            callback(err, rows);
        });
    }
};


ModuloModel.prototype.insertarModulo = function(modulo, callback) {

    var sql = "INSERT INTO modulos (parent, nombre, url, parent_name, icon, state, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";


    var params = [
        modulo.parent, modulo.nombre, modulo.url, modulo.parent_name, modulo.icon,
        modulo.state, modulo.observacion, modulo.usuario_id, 'now()', Number(modulo.estado)
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.modificarModulo = function(modulo, callback) {


    var sql = "UPDATE modulos SET parent = $1, nombre = $2, url =$3, parent_name = $4,\
               icon = $5, state = $6, observacion = $7, usuario_id = $8, usuario_id_modifica = $9,\
               estado = $10, fecha_modificacion = $11 WHERE id = $12  \
               ";

    var params = [
        modulo.parent, modulo.nombre, modulo.url, modulo.parent_name, modulo.icon,
        modulo.state, modulo.observacion, modulo.usuario_id, modulo.usuario_id,
        Number(modulo.estado), 'now()', modulo.modulo_id
    ];

    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.obtenerModuloPorNombreOUrl = function(nombre, url, callback) {
    var sql = "SELECT  nombre, state, id FROM modulos WHERE nombre ILIKE $1 OR state ILIKE $2";
           
    G.db.query(sql,  [nombre + "%", url + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};




module.exports = ModuloModel;