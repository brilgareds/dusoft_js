
var fs = require('fs');

exports.index = function(req, res) {
    res.render('index', {title: 'Express'});
};


exports.configurarRoutes = function(req, res, app, di_container) {

    var recargar_routes = true;
    _routes(app, di_container, recargar_routes, function(resultado, msj) {
        res.send({msj: msj});
    });
};


exports.cargarRoutes = function(app, di_container, io) {
    var recargar_routes = false;
    return _routes(app, di_container, io, recargar_routes);
};


function _routes(app, di_container, io, recargar_routes, callback) {

    var listado_modulos = fs.readdirSync(__dirname);
    var modulos_no_cargados = [];
    listado_modulos.forEach(function(modulo) {
        //try
        //{
            if (fs.lstatSync(__dirname + '/' + modulo).isDirectory()) {
        console.log(modulo);

                if (recargar_routes) {
                    delete require.cache[require.resolve(__dirname + '/' + modulo + '/routes')];
                }

                require(__dirname + '/' + modulo + '/routes')(app, di_container, io);
            }
        /*}
        catch (e) {
            console.log('Error cargando el modulo ' + modulo);
            console.log(e)
            modulos_no_cargados.push(modulo);
        }*/
    });

    var resultado = true;
    if (modulos_no_cargados.length > 0)
        resultado = false;

    var msj = 'Modulos Cargados Correctamente';
    if (modulos_no_cargados.length > 0)
        msj = 'Error Cargando los siguientes modulos ' + modulos_no_cargados.join();

    if (callback !== undefined)
        callback(resultado, msj);
    else
        return resultado;
}