
exports.set = function(req, res) {
    res.send(G.utils.r(req.url, 'En la funcion SET', 200, {}));
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



