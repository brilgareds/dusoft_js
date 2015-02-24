var ModuloModel = function() {

};


ModuloModel.prototype.listar_modulos = function(callback) {


    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.guardarModulo = function(modulo, callback) {
    var self = this;
    
    if(modulo.id){
        self.modificarModulo(modulo, function(err, rows){
            callback(err, rows);
        });
    } else {
        self.insertarModulo(modulo, function(err, rows){
            callback(err, rows);
        });
    }

    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.insertarModulo = function(modulo,callback) {


    var sql = "INSERT INTO modulos (parent, nombre, url, parent_name, icon, state, observacion, usuario_id,\
               fecha_creacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
    
    
    var params = [
        modulo.parent, modulo.nombre, modulo.url, modulo.parent_name, modulo.icon,
        modulo.state, modulo.descripcion, modulo.usuario_id, 'now()', Number(modulo.estado)
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
                    modulo.state, modulo.descripcion, modulo.usuario_id, modulo.usuario_id,
                    Number(modulo.estado), 'now()', modulo.id
                 ];
    
    G.db.query(sql, params, function(err, rows, result) {
        callback(err, rows);
    });
};




module.exports = ModuloModel;