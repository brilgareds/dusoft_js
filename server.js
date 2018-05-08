/*=========================================
 * Modulos y Dependecias
 * =========================================*/
var express = require('express');
var compression = require('compression');
var modulos = require('./app_modules/');
var http = require('http');
var https = require('https');
var path = require('path');
var intravenous = require('intravenous');
var Measured = require('measured');

var nodemailer = require('nodemailer');
var date_utils = require('date-utils');
var multipart = require('connect-multiparty');

//var jsreport = require("jsreport");

var accounting = require("accounting");
var cacheKey = "dusoft";

if(process.argv.indexOf("cacheKey") !== -1){ 
    cacheKey = process.argv[process.argv.indexOf("cacheKey") + 1]; 
    console.log("Limpiar cache con llave ", cacheKey);
} 


/*=========================================
 * Variables Globales
 * =========================================*/
G = {};
G.dirname = __dirname;
G.settings = require('./lib/Settings').create();
G.log = require('log4js');
G.utils = require('./lib/Utils');
G.random = require('./lib/Random');
G.auth = require('./lib/Authentication');
G.fs = require('fs-extra');
G.Excel = require('exceljs');;
G.path = path;
G.Q = require('q');
G.accounting = accounting;
G.XlsParser =  require("./lib/XlsParser");
G.moment = require("moment");
G.jsonQuery = require('jinq');
G.json2csv = require('json2csv');
G.fcmPush = require('fcm-push');
G.sqlformatter = require('sqlformatter');
var events = require('events');
G.eventEmitter = new events.EventEmitter();
G.logError =  function logError(texto) {  
      //hora y guardas separadoras entre errores
      var f=new Date();
      var cad= f.getHours()+":"+f.getMinutes()+":"+f.getSeconds(); 
      var guardaInicio = '\n================================================================================ ERROR '+cad+' ================================================================================\n\n';
      var guardaFin = '\n\n********************************************************************************************************************************************************************************\n\n\n\n';
      var f = new Date();
      var nombreArchivo = f.getFullYear() + '' + ("0" + (f.getMonth() + 1)).slice(-2) + '' + f.getDate();
      var file = './public/logs/error_'+ nombreArchivo +'.log';

      try {
          G.fs.statSync(file);
      } catch(e) {
          fs.writeFile(file, '', { flag: 'w' }, function (err) {
              if (err) {
                throw err
              }
          });
      }
      G.fs.appendFile(file, guardaInicio + texto + guardaFin, function(err){
      });
  };


//G.moment = G.moment().format();
G.sqlformatter = require('sqlformatter');
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
        .option('-Z, --dev170', 'Run server in base de datos 170')     
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
else if (G.program.dev170)
    G.settings.setEnv(G.settings.env170());
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
        RedisStore = require("socket.io-redis"),
        redis = require("redis"),
        pub = redis.createClient(6379, "localhost", {return_buffers: true}),
        sub = redis.createClient(6379, "localhost", {return_buffers: true}),
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

    //Carga de Certificados autogenerados para funcionamiento con https
    var key = G.fs.readFileSync('key.pem');
    var cert = G.fs.readFileSync( 'localhost.crt' );

    var options = {
      key: key,
      cert: cert
    };

/*
   //crea servidor http
    var app = express();
    var server = app.listen(G.settings.server_port);
    var container = intravenous.create();

    //crea servidor https
    var server = https.createServer(options, app).listen(G.settings.https_server_port);
    var io = require('socket.io').listen(server, { log: false })


*/
    //crea servidor http
    var app = express();    
    var server = app.listen(G.settings.server_port);
    var container = intravenous.create();
    var io = require('socket.io').listen(server);

    //crea servidor https
    //var server_https = https.createServer(options, app).listen(G.settings.https_server_port);
    //var io2 = require('socket.io').listen(server_https, {log: false});


    /*=========================================
     * Configuracion Sockets.io
     * =========================================*/
    /*io.configure(function() {
        io.set("log level", 0);

    });*/

    /*io.set("store", new RedisStore(
            pub,
            sub,
            client
    ));*/
    
    

    //Se usa la libreria Measured para registrar estadisticas de peticiones.
    G.stats = Measured.createCollection();
    app.use(function(req, res, next) {
        G.stats.meter('requestsPerSecond').mark();
        next();
    });

    //Se usa la libreria Measured para medida de uso de memoria
    G.gauge = new Measured.Gauge(function() {
        return process.memoryUsage().rss;
    });
    
    var redisOptions = {
        pubClient: pub,
        subClient: sub,
        host: "redis://localhost",
        port: 6379
    };
    
    io.adapter(RedisStore(redisOptions));

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
    app.use(express.compress({
        threshold : 0
    }));
    app.use(compression());
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
    
    if (G.program.prod) {
        app.use(express.static(path.join(__dirname, 'public'), { maxAge: tiempo } ));
    } else {
        app.use(express.static(path.join(__dirname, 'public')));
    }
    
    app.use(express.static(path.join(__dirname, 'files')));
    
    /*=========================================
     * error handlers
     * development error handler
     * will print stacktrace
     * =========================================*/
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            //registra en log de errores
            var url = '\nURL: ' + req.originalUrl + '\n';
            G.logError(url + err);

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
        G.logError(err);
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
    
    //Obtiene contenido estatico basado en la llave de cache
    app.all("*",function(req, res, next){
        var url = req.protocol + '://' + req.get('host') + req.originalUrl;

        if(req.originalUrl.match(/[^/]+(jpg|png|gif|html|css|js)$/)){
            
            //La validacion del archivo del main-dev se delega en otro router
            if(!req.originalUrl.match(/main-dev/g)){
                res.redirect(req.originalUrl+ "?c="+cacheKey);
                return;
            }

        }
        
        next();

    });
    
    //Si el servidor esta en modo produccion se sobreescribe el mand-dev.js por el de produccion
    app.all('/dusoft_duana/:type(*)/main-dev.js', function(req, res, next) {
        
        if(!G.program.prod ) {
           next();
           return;
        } else {
            var url = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect(url.replace("main-dev", "dist/main")+ "?c="+cacheKey);
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