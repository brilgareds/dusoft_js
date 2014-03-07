var UsuariosModel = function() {

};



// Crear los operarios de bodega
UsuariosModel.prototype.listar_usuarios_sistema = function(termino_busqueda, estado, callback) {

    // Estado = '' -> Todos
    // Estado = 1 -> Activos
    // Estado = 0 -> Inactivos
    
    
    var sql_aux = ";";
    if(estado !== ''){
        sql_aux = " and a.activo = '"+estado+"'";
    }

    var sql = "SELECT * FROM system_usuarios a where (a.usuario ilike $1 or a.nombre ilike $1 or a.descripcion ilike $1) "+ sql_aux;               
    
    G.db.query(sql, ["%"+termino_busqueda+"%"], function(err, rows, result) {
        callback(err, rows);
    });
};

module.exports = UsuariosModel;