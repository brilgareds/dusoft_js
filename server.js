/*=========================================
 * Modulos y Dependecias
 * =========================================*/
var express = require('express');
var modulos = require('./app_modules/');
var http = require('http');
var path = require('path');
var intravenous = require('intravenous');
var program = require('commander');
var nodemailer = require('nodemailer');
var date_utils = require('date-utils');

/*=========================================
 * Variables Globales
 * =========================================*/
G = {};
G.settings = require('./lib/Settings').create();
G.db = require('./lib/Pg').create();
G.log = require('./lib/Logs');
G.utils = require('./lib/Utils');
G.random = require('./lib/Random');
G.auth = require('./lib/Authentication');

/*=========================================
 * Comandos del Servidor
 * =========================================*/

program
        .version(G.settings.version)
        .option('-p, --port <n>', 'Run server on provided port', parseInt)
        .option('-d, --dev', 'Run server in Development mode')
        .option('-t, --test', 'Run server in Testing mode')
        .option('-e, --eco', 'Run server in Testing mode in ecodev')
        .option('-P, --prod', 'Run server in Production mode')
        .option('-c, --config', 'Output settings');
program.parse(process.argv);


/*=========================================
 * Configuracion de Enviroment
 * =========================================*/
if (program.dev)
    G.settings.setEnv(G.settings.envDevelopment());
else if (program.test)
    G.settings.setEnv(G.settings.envTesting());
else if (program.prod)
    G.settings.setEnv(G.settings.envProduction());
else if (program.eco)
    G.settings.setEnv(G.settings.envExternalTesting());
else
    G.settings.setEnv(G.settings.env);

if (program.port)
    G.settings.server_port = program.port;


if (program.config) {
    G.settings.outputConfig();
    return;
}
;

/*=========================================
 * Inicializacion del Servidor
 * =========================================*/
var app = express();
var server = app.listen(G.settings.server_port);
var io = require('socket.io').listen(server);
var container = intravenous.create();


/*=========================================
 * Configuracion Sockets.io
 * =========================================*/
io.configure(function() {
    io.set("log level", 0);
});


/*=========================================
 * Registrar dependecias en el contendorDI
 * =========================================*/
container.register("emails", nodemailer);
container.register("date_utils", date_utils);
container.register("socket", io);

/*=========================================
 * Inicializacion y Conexion a la Base de Datos
 * =========================================*/
G.db.setCredentials(G.settings.dbHost, G.settings.dbUsername, G.settings.dbPassword, G.settings.dbName);

/*=========================================
 * Configuracion Express.js
 * =========================================*/
app.set('port', process.env.PORT || G.settings.server_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//========================================
app.use(express.cookieParser('123Dusoft123'));
app.use(express.session());
//========================================
app.use(G.utils.validar_request());
app.use(G.auth.validate());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


/*=========================================
 * error handlers
 * development error handler
 * will print stacktrace
 * =========================================*/
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {}));
    });
}

/*=========================================
 * production error handler
 * no stacktraces leaked to user
 * =========================================*/
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(G.utils.r(req.url, 'Se ha generado un error interno ', 500, {}));
});

/*=========================================
 * Ruteo del Servidor
 * =========================================*/
modulos.cargarRoutes(app, container, io);

app.get('/api/configurarRoutes', function(req, res) {
    modulos.configurarRoutes(req, res, app, container);
});

app.post('/testing', function(req, res) {
    console.log('=== ===');
    res.send(200, {msj: ' Servicio de Prueba '});
});


app.all('/dusoft_duana', function(req, res) {
    res.redirect('/dusoft_duana/login');
});

console.log('Express server listening on port ' + app.get('port') + ' in Dir '+ __dirname);

