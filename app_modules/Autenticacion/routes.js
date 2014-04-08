module.exports = function(app, di_container, io) {


    /*var emails = di_container.get("emails");
     console.log(emails);
     return;*/

    var auth_controller = require('./controllers/AutenticacionController');
    var auth_events = require('./events/AutenticacionEvents');
    var auth_model = require('./models/AutenticacionModel');
    var auth_cron = require('./cronjobs/AutenticacionCronJobs');

    var usuarios_model = require('../Usuarios/models/UsuariosModel');


    di_container.register("socket", io);                // Socket
    di_container.register("c_auth", auth_controller);   // Controllers
    di_container.register("e_auth", auth_events);       // Events
    di_container.register("m_auth", auth_model);        // Models
    di_container.register("j_auth", auth_cron);         // CronJobs

    di_container.register("m_usuarios", usuarios_model);

    var c_auth = di_container.get("c_auth");
    var e_auth = di_container.get("e_auth");
    var j_auth = di_container.get("j_auth");

    // Router
    app.post('/login', function(req, res) {
        c_auth.loginUsuario(req, res);
    });
    
    app.post('/api/lockScreen', function(req, res) {
        c_auth.lockScreen(req, res);
    });
    
    app.post('/api/unlockScreen', function(req, res) {
        c_auth.unlockScreen(req, res);
    });

    app.post('/forgout', function(req, res) {
        c_auth.recuperarContrasenia(req, res);
    });

    app.post('/api/logout', function(req, res) {
        c_auth.logoutUsuario(req, res);
    });

    // Events 
    io.sockets.on('connection', function(socket) {

        e_auth.onConnected(socket.id);

        socket.on('onActualizarSesion', function(datos) {
            e_auth.onActualizarSesion(datos);
        });
    });

    // Ejecutar Tareas Programadas
    j_auth.cerrarSesionesInactivas();

};