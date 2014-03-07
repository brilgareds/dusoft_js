var TercerosModel = function() {

};



// Crear los operarios de bodega
TercerosModel.prototype.crear_operarios_bodega = function(nombre_operario, usuario_id, estado, callback) {

    var sql = "INSERT INTO operarios_bodega (nombre, usuario_id, estado) VALUES ( $1, $2, $3 );";

    G.db.query(sql, [nombre_operario, usuario_id, estado], function(err, rows, result) {
        callback(err, rows);
    });
};

// Modificar los operarios de bodega
TercerosModel.prototype.modificar_operarios_bodega = function(operario_id, nombre_operario, usuario_id, estado, callback) {

    var sql = "UPDATE operarios_bodega SET nombre= $2, usuario_id=$3, estado=$4 WHERE operario_id = $1 ;";

    G.db.query(sql, [operario_id, nombre_operario, usuario_id, estado], function(err, rows, result) {
        callback(err, rows);
    });
};


// Lista los operarios de bodega
TercerosModel.prototype.listar_operarios_bodega = function(termino_busqueda, estado_registro, callback) {

    // Estado = '' -> Todos
    // Estado = 1 -> Activos
    // Estado = 0 -> Inactivos


    var sql_aux = "";
    if (estado_registro !== '') {
        sql_aux = " and a.estado = '" + estado_registro + "'";
    }

    var sql = " select \
                a.operario_id, \
                a.nombre as nombre_operario, \
                a.usuario_id, \
                b.usuario as descripcion_usuario, \
                a.estado, \
                case when a.estado='1' then 'Activo' else 'Inactivo' end as descripcion_estado \
                from operarios_bodega a \
                left join system_usuarios b on a.usuario_id = b.usuario_id \
                where a.nombre ilike $1 " + sql_aux + " order by 2 ";

    G.db.query(sql, ["%" + termino_busqueda + "%"], function(err, rows, result) {
        callback(err, rows);
    });
};

// Selecciona un operario de bodega, por el ID
TercerosModel.prototype.seleccionar_operario_bodega = function(operario_id, callback) {

    var sql = "select operario_id, nombre as nombre_operario, usuario_id, estado from operarios_bodega where operario_id = $1";

    G.db.query(sql, [operario_id], function(err, rows, result) {
        callback(err, rows);
    });

};


module.exports = TercerosModel;