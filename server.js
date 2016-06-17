/*=========================================
 * Modulos y Dependecias
 * =========================================*/
var express = require('express');
var modulos = require('./app_modules/');
var http = require('http');
var path = require('path');
var intravenous = require('intravenous');

var nodemailer = require('nodemailer');
var date_utils = require('date-utils');
var multipart = require('connect-multiparty');

//var jsreport = require("jsreport");

var accounting = require("accounting");


/*=========================================
 * Variables Globales
 * =========================================*/
G = {};
G.dirname = __dirname;
G.settings = require('./lib/Settings').create();
G.log = require('./lib/Logs');
G.utils = require('./lib/Utils');
G.random = require('./lib/Random');
G.auth = require('./lib/Authentication');
G.fs = require('fs-extra');
G.path = path;
G.Q = require('q');
G.accounting = accounting;
G.XlsParser =  require("./lib/XlsParser");
G.moment = require("moment");

var events = require('events');
G.eventEmitter = new events.EventEmitter();

//G.moment = G.moment().format();

G.soap = require('soap');
G.program = require('commander');
/**
 * +Descripcion:Se añade dependencia para importar archivo .XLS
 * @fecha: 29/10/2015
 * 
 * */



var reportUrl = G.settings.reportsUrl;
//argumento del puerto

if(process.argv.indexOf("-report") != -1){ 
    reportUrl = process.argv[process.argv.indexOf("-report") + 1]; 
    console.log(reportUrl);
}

G.jsreport = require("jsreport-client")(reportUrl);
//G.thread = require('webworker-threads');

/*=========================================
 * Comandos del Servidor
 * =========================================*/

G.program
        .version(G.settings.version)
        .option('-p, --port <n>', 'Run server on provided port', parseInt)
        .option('-d, --dev', 'Run server in Development mode')
        .option('-t, --test', 'Run server in Testing mode')
        .option('-e, --eco', 'Run server in Testing mode in ecodev')
        .option('-P, --prod', 'Run server in Production mode')
        .option('-c, --config', 'Output settings');
G.program.parse(process.argv);

G.constants =  require("./lib/Constants").create();

/*=========================================
 * Configuracion de Enviroment
 * =========================================*/
if (G.program.dev)
    G.settings.setEnv(G.settings.envDevelopment());
else if (G.program.test)
    G.settings.setEnv(G.settings.envTesting());
else if (G.program.prod)
    G.settings.setEnv(G.settings.envProduction());
else
    G.settings.setEnv(G.settings.env);

if (G.program.port)
    G.settings.server_port = G.program.port;


if (G.program.config) {
    G.settings.outputConfig();
    return;
}

/*=========================================
 * Monitoring Server only Production
 * =========================================*/
if (G.program.prod) {
    //require('newrelic');
}


/*=========================================
 * Inicializacion del Servidor
 * =========================================*/

//determina el numero de procesadores del servidor, de modo que se concrete los workers que permite el balanceo de carga
    
G.knex = require('./lib/Knex').
         create(G.settings.dbHost, G.settings.dbUsername, G.settings.dbPassword, G.settings.dbName).
         connect().getInstance();
     
 


var cluster = require('cluster'),
        RedisStore = require("socket.io/lib/stores/redis"),
        redis = require("socket.io/node_modules/redis"),
        pub = redis.createClient(),
        sub = redis.createClient(),
        client = redis.createClient();

G.cronJob = require('cron-cluster')(client).CronJob;
G.redis = client;

if (cluster.isMaster) {

    var numCPUs = require('os').cpus().length;
    console.log("number of CPUS ", numCPUs );

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        G.knex.destroy();
        //se reemplaza el worker que acaba de caer
        cluster.fork();
    });
    
} else {


    var app = express();
    var server = app.listen(G.settings.server_port);
    var io = require('socket.io').listen(server);
    var container = intravenous.create();


    /*=========================================
     * Configuracion Sockets.io
     * =========================================*/
    io.configure(function() {
        io.set("log level", 0);
        /*io.set('transports', [
         'websocket'
         ]);*/
    });

    io.set("store", new RedisStore(
            pub,
            sub,
            client
    ));


    /*=========================================
     * Registrar dependecias en el contendorDI
     * =========================================*/
    container.register("emails", nodemailer);
    container.register("date_utils", date_utils);
    container.register("socket", io);

    /*=========================================
     * Inicializacion y Conexion a la Base de Datos
     * =========================================*/
   // G.db.setCredentials(G.settings.dbHost, G.settings.dbUsername, G.settings.dbPassword, G.settings.dbName);

    /*=========================================
     * Configuracion Express.js
     * =========================================*/
    var tiempo = 10800000;
    app.set('port', process.env.PORT || G.settings.server_port);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(multipart());
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
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: tiempo } ));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'files')));
    
    
   
    

    /*=========================================
     * error handlers
     * development error handler
     * will print stacktrace
     * =========================================*/
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            console.log(err);
            res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1  ', 500, {msj: err}));
        });
    }

    /*=========================================
     * production error handler
     * no stacktraces leaked to user
     * =========================================*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 2', 500, {msj: err}));
    });

    /*========================================
     Carga libreria de reportes
     ==========================================*/
    /*jsreport.bootstrapper({
        logger: {providerName: "console"}
    }).start().then(function(bootstrapper) {
        G.jsreport = bootstrapper;
    });*/

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
    
    app.all('/dusoft_duana/:type(*)/main-dev.js', function(req, res, next) {
        
        //Si es produccion se hace render del css normal
        if(!G.program.prod ) {
           next();
           return;
        } else {
            
            var cacheKey = "d";
            
            if(process.argv.indexOf("cacheKey") !== -1){ 
                cacheKey = process.argv[process.argv.indexOf("cacheKey") + 1]; 
                console.log("Limpiar cache con llave ", cacheKey);
            } 
            
            var url = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect(url.replace("main-dev", "dist/main")+ "?"+cacheKey);
        }
    });
    
    //Permite hacer render de reglas especificas de css para el entorno de pruebas
    app.all('/stylesheets/style.css', function(req, res, next){
        console.log("params for query ", req.query);
        
        //Si es produccion se hace render del css normal
        if(G.program.prod || req.query.prod) {
           next();
           return;
        } else {
           var path = "public/stylesheets/style-dev.css";
           var file = G.fs.readFileSync(path);
           res.writeHeader(200, {"Content-Type": "text/css"});  
           res.write(file);
           res.end(); 
        }
        
                
    });

    process.on('SIGINT', function() {
        io.sockets.emit('onDisconnect');


        for (var id in cluster.workers) {
            console.log("killing worker ", cluster.workers[id]);
            cluster.workers[id].kill();
        }
        // exit the master process
        process.exit(0);

    });
    
    //Notificaciones 
    container.get("c_notificaciones");

    console.log('Express server listening on port _______________________________ ' + app.get('port') + ' in Dir ' + __dirname);

}