/*=========================================
 * Modulos y Dependecias
 * =========================================*/
var express = require('express');
var modulos = require('./app_modules/');
var http = require('http');
var path = require('path');
var intravenous = require('intravenous');
var program = require('commander');


/*=========================================
 * Variables Globales
 * =========================================*/
G = {};
G.settings = require('./lib/Settings').create();
G.db = require('./lib/Pg').create();
G.log = require('./lib/Logs');
G.utils = require('./lib/Utils');
G.auth = require('./lib/Authentication');

/*=========================================
 * Comandos del Servidor
 * =========================================*/

program
        .version(G.settings.version)
        .option('-p, --port <n>', 'Run server on provided port', parseInt)
        .option('-d, --dev', 'Run server in Development mode')
        .option('-t, --test', 'Run server in Testing mode')
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
app.use(G.auth.validate());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*=========================================
 * Configuracion Sockets.io
 * =========================================*/
io.configure(function() {
    io.set("log level", 0);
});

/*=========================================
 * Ruteo del Servidor
 * =========================================*/
modulos.cargarRoutes(app, container, io);

app.get('/api/configurarRoutes', function(req, res) {
    modulos.configurarRoutes(req, res, app, container);
});

app.all('/dusoft_duana', function(req, res) {
    res.redirect('/dusoft_duana/login');
});


/*=========================================
 * Servidor de Sockets
 * =========================================*/

/*io.sockets.on('connection', function(socket) {
 
    socket.on('regitrar_clientes', function(cliente) {
        console.log('El Cliente ' + cliente + ' Se ha conectado al servidor');
        socket.emit('resultado_conexion', {cliente: cliente, resultado: true});
    });

    socket.on('enviar_mensaje', function(mensaje) {
        socket.broadcast.emit('recibir_mensaje', mensaje);
    });

    if (clients.length === 3) {
        clients.forEach(function(client) {
            io.sockets.socket(client).emit('recibir_mensaje', {msj: 'Servidor Saludado a todos sus clientes '});
        });
    }
});*/


console.log('Express server listening on port ' + app.get('port'));

