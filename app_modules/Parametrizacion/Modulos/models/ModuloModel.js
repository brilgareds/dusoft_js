var ModuloModel = function() {

};


ModuloModel.prototype.listar_modulos = function(callback) {


    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.guardarModulo = function(callback) {


    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};


ModuloModel.prototype.insertarModulo = function(callback) {


    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};

ModuloModel.prototype.modificarModulo = function(callback) {


    var sql = "SELECT * FROM modulos ";

    G.db.query(sql, [], function(err, rows, result) {
        callback(err, rows);
    });
};




module.exports = ModuloModel;