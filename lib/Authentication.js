
exports.set = function(req, res) {
    res.send(G.utils.r(req.url, 'En la funcion SET', 200, {}));
};


exports.get = function(usuario_id, callback) {

    var sql = "select * from system_usuarios_sesiones a where a.usuario_id= $1";
    
    G.db.query(sql, [usuario_id], function(err, rows, result) {
        callback(err, rows);
    });
    
};

exports.validate = function() {
    return function(req, res, next) {

        next();
        /*if (!!req.url.match(/^(\/api\/)/)) {
         if (req.query.x === "123456")
         next();
         else
         res.send(G.utils.r(req.url, 'No esta Authenticado', 404, {}));
         } else {
         next();
         }*/
    };
};

exports.destroy = function(req, res) {
    res.send(G.utils.r(req.url, 'En la funcion Destory', 200, {}));
};



