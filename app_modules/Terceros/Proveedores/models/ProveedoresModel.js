var ProveedoresModel = function() {

};

ProveedoresModel.prototype.listar_proveedores = function(termino_busqueda, callback) {

    var sql = " select \
                b.codigo_proveedor_id,\
                a.tipo_id_tercero,\
                a.tercero_id,\
                a.nombre_tercero as nombre_proveedor,\
                a.direccion,\
                a.telefono \
                from terceros a \
                inner join terceros_proveedores b on a.tipo_id_tercero = b.tipo_id_tercero and a.tercero_id = b.tercero_id\
                where a.tipo_id_tercero ilike '%%' or \
                a.tercero_id ilike $1 or \
                a.nombre_tercero ilike $1 or \
                a.direccion ilike $1 or  \
                a.telefono ilike $1 ORDER BY 4 " ;

    G.db.query(sql, [termino_busqueda], function(err, rows, result) {
        callback(err, rows);
    });
};




module.exports = ProveedoresModel;