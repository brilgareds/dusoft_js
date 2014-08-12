
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

    //==============================================================
    // cargar archivos de configuracion 
    //==============================================================
    listado_modulos.forEach(function(modulo) {

        if (fs.lstatSync(__dirname + '/' + modulo).isDirectory()) {
            if (fs.existsSync(__dirname + '/' + modulo + '/config.json')) {
                try {
                    var config = require(__dirname + '/' + modulo + '/config.json');

                    _load_config(di_container, config, modulo);

                } catch (e) {
                    console.log('!!!! Error Cargando configuraciones del modulo ' + modulo + ' JSON Failed!!!!!', e);
                }

            } else {
                var listado_submodulos = fs.readdirSync(__dirname + '/' + modulo);

                listado_submodulos.forEach(function(submodulo) {

                    if (fs.lstatSync(__dirname + '/' + modulo + '/' + submodulo).isDirectory() && fs.existsSync(__dirname + '/' + modulo + '/' + submodulo + '/config.json')) {

                        try {

                            var config = require(__dirname + '/' + modulo + '/' + submodulo + '/config.json');
                            _load_config(di_container, config, modulo, submodulo);

                        } catch (e) {
                            console.log('!!!! Error Cargando configuraciones del submodulo ' + submodulo + ' JSON Failed!!!!!', e);
                        }
                    }
                });
            }
        }
    });

    //==============================================================
    // cargar routes Modulos
    //==============================================================
    listado_modulos.forEach(function(modulo) {
        try
        {
            if (fs.lstatSync(__dirname + '/' + modulo).isDirectory() && fs.existsSync(__dirname + '/' + modulo + '/routes.js')) {
                if (recargar_routes) {
                    delete require.cache[require.resolve(__dirname + '/' + modulo + '/routes')];
                }
                require(__dirname + '/' + modulo + '/routes')(app, di_container);
            } else {
                //==============================================================
                // cargar routes SubModulos
                //==============================================================

                if (fs.lstatSync(__dirname + '/' + modulo).isDirectory()) {
                    var listado_submodulos = fs.readdirSync(__dirname + '/' + modulo);

                    listado_submodulos.forEach(function(submodulo) {

                        if (fs.lstatSync(__dirname + '/' + modulo + '/' + submodulo).isDirectory() && fs.existsSync(__dirname + '/' + modulo + '/' + submodulo + '/routes.js')) {
                            require(__dirname + '/' + modulo + '/' + submodulo + '/routes')(app, di_container);
                        }
                    });

                }
            }
        }
        catch (e) {
            console.log('Error cargando el modulo ' + modulo);
            console.log(e);
            modulos_no_cargados.push(modulo);
        }

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



function _load_config(di_container, config, modulo, submodulo) {

    //console.log(modulo, submodulo);

    var module = (submodulo === '' || submodulo === undefined) ? modulo : submodulo;
    var txt_module = (submodulo === '' || submodulo === undefined) ? "Modulo" : "Submodulo";


    if (config.hasOwnProperty('module') && config.hasOwnProperty('dependency')) {
        if (config.module === module) {

            if (config.dependency.hasOwnProperty('controllers') && config.dependency.hasOwnProperty('models') && config.dependency.hasOwnProperty('events') && config.dependency.hasOwnProperty('cronJobs')) {

                console.log('=== Cargando Archivos de Configuración del ' + txt_module + ' ' + module + ' ========');

                var controllers = config.dependency.controllers;
                var models = config.dependency.models;
                var events = config.dependency.events;
                var cronJobs = config.dependency.cronJobs;

                //Cargar Controladores del Modulo
                controllers.forEach(function(data, i) {
                    for (obj in data) {
                        if (data[obj].hasOwnProperty('module') && data[obj].hasOwnProperty('controller') && data[obj].hasOwnProperty('alias')) {
                            var alias = data[obj].alias;
                            var module = data[obj].module;
                            var controller = data[obj].controller;

                            //var url = (submodulo === '' || submodulo === undefined) ? __dirname + '/' + module + '/controllers/' + controller : __dirname + '/' + modulo + '/' + module + '/controllers/' + controller;
                            var url = __dirname + '/' + module + '/controllers/' + controller;

                            di_container.register(alias, require(url));
                        }
                    }
                });
                //Cargar modelos del Modulo
                models.forEach(function(data, i) {
                    for (obj in data) {
                        if (data[obj].hasOwnProperty('module') && data[obj].hasOwnProperty('model') && data[obj].hasOwnProperty('alias')) {
                            var alias = data[obj].alias;
                            var module = data[obj].module;
                            var model = data[obj].model;

                            //var url = (submodulo === '' || submodulo === undefined) ? __dirname + '/' + module + '/models/' + model : __dirname + '/' + modulo + '/' + module + '/models/' + model;
                            var url = __dirname + '/' + module + '/models/' + model;

                            di_container.register(alias, require(url));
                        }
                    }
                });
                //Cargar events del modulo
                events.forEach(function(data, i) {
                    for (obj in data) {
                        if (data[obj].hasOwnProperty('module') && data[obj].hasOwnProperty('event') && data[obj].hasOwnProperty('alias')) {
                            var alias = data[obj].alias;
                            var module = data[obj].module;
                            var event = data[obj].event;

                            //var url = (submodulo === '' || submodulo === undefined) ? __dirname + '/' + module + '/events/' + event : __dirname + '/' + modulo + '/' + module + '/events/' + event;
                            var url = __dirname + '/' + module + '/events/' + event;

                            di_container.register(alias, require(url));
                        }
                    }
                });
                //Cargar cronJobs del modelos 
                cronJobs.forEach(function(data, i) {
                    for (obj in data) {
                        if (data[obj].hasOwnProperty('module') && data[obj].hasOwnProperty('cronjob') && data[obj].hasOwnProperty('alias')) {
                            var alias = data[obj].alias;
                            var module = data[obj].module;
                            var cronJob = data[obj].cronjob;

                            //var url = (submodulo === '' || submodulo === undefined) ? __dirname + '/' + module + '/cronjobs/' + cronJob : __dirname + '/' + modulo + '/' + module + '/cronjobs/' + cronJob;
                            var url = __dirname + '/' + module + '/cronjobs/' + cronJob;

                            di_container.register(alias, require(url));
                        }
                    }
                });
            }
        } else {
            console.log('!!!! Error , El Nombre del Modulo No Coincide con el registrado en el Archivo config.json !!!!!');
        }
    } else {
        console.log('!!!! Error Cargando configuraciones del modulo ' + modulo + ' No tiene las propiedades module o dependecy !!!!!');
    }

}
;

/*function _routes(app, di_container, io, recargar_routes, callback) {
 
 var listado_modulos = fs.readdirSync(__dirname);
 var modulos_no_cargados = [];
 listado_modulos.forEach(function(modulo) {
 try
 {
 if (fs.lstatSync(__dirname + '/' + modulo).isDirectory()) {
 console.log(modulo);
 
 if (recargar_routes) {
 delete require.cache[require.resolve(__dirname + '/' + modulo + '/routes')];
 }
 
 require(__dirname + '/' + modulo + '/routes')(app, di_container, io);
 }
 }
 catch (e) {
 console.log('Error cargando el modulo ' + modulo);
 console.log(e)
 modulos_no_cargados.push(modulo);
 }
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
 }*/