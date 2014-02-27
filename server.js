
/**
 * Module dependencies.
 */

var express = require('express');
var modulos = require('./app_modules/');
var http = require('http');
var path = require('path');
var intravenous = require('intravenous');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var container = intravenous.create();



/*=========================================
 * Global Utilities
 * =========================================*/
G = {};
G.db = require('./lib/Pg').create();
G.log = require('./lib/Logs');
G.utils = require('./lib/Utils');


/*=========================================
 * Database Connection
 * =========================================*/
G.db.setCredentials('10.0.2.169', 'admin', 'admin', 'dusoft_23_01_2014');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Cargar Routes de los Modulos de Dusoft
modulos.cargarRoutes(app, container);

app.get('/api/configurarRoutes', function(req, res) {
    modulos.configurarRoutes(req, res, app, container);
});

app.all('/dusoft_duana', function(req, res) {
    res.redirect('/dusoft_duana/login');
});


// Socket server 

io.configure(function() {
    io.set("log level", 0);
});

var clients = [];
io.sockets.on('connection', function(socket) {

    clients.push(socket.id);


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
    //socket.broadcast.emit('recibir_mensaje', {msj: 'Servidor Saludado a todos sus clientes '});
});


console.log('Express server listening on port ' + app.get('port'));

/*http.createServer(app).listen(app.get('port'), function() {
 console.log('Express server listening on port ' + app.get('port'));
 });*/
