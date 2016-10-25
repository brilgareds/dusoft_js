module.exports = function(app, di_container) {

    var c_auth = di_container.get("c_auth");
    var e_auth = di_container.get("e_auth");
    var j_auth = di_container.get("j_auth");
    var io = di_container.get("socket");

    // Router
    app.post('/login', function(req, res) {
        c_auth.loginUsuario(req, res);
    });
    
    app.post('/api/lockScreen', function(req, res) {
        c_auth.lockScreen(req, res);
    });
    
    app.post('/api/unlockScreen', function(req, res) {
        c_auth.unLockScreen(req, res);
    });

    app.post('/forgout', function(req, res) {
        c_auth.recuperarContrasenia(req, res);
    });

    app.post('/api/logout', function(req, res) {
        c_auth.logoutUsuario(req, res);
    });
    
    app.post('/api/sessions', function(req, res) {
        c_auth.sessions(req, res);
    });
    

    // Events 
    io.sockets.on('connection', function(socket) {

        e_auth.onConnected(socket.id);

        socket.on('onActualizarSesion', function(datos) {
            e_auth.onActualizarSesion(datos);
        });
    });

    io.sockets.on('chatDevice', function(socket) {

        console.log("on chat device >>>>>>>>>>>>>>>>>>>>>>>> ", socket);
    });

    // Ejecutar Tareas Programadas
    j_auth.cerrarSesionesInactivas();

};