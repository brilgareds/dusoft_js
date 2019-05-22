module.exports = function(app, di_container) {
   
    let c_sistema = di_container.get('c_sistema');
    let e_sistema = di_container.get("e_sistema");
    let io = di_container.get("socket");
    
    app.post('/api/Sistema/listarLogs', function(req, res) {
         c_sistema.listarLogs(req, res);
    });

    app.post('/api/Sistema/listarLogsVersion', function(req, res) {
         c_sistema.listarLogsVersion(req, res);
    });

    app.post('/api/Sistema/verificarSincronizacion', function(req, res) {
         c_sistema.jasperReport(req, res);
    });
    
    app.post('/api/Sistema/sshConnection', function(req, res) {
         c_sistema.sshConnection(req, res);
    });

    app.post('/api/Sistema/querysActiveInDb', (req, res) => {
        c_sistema.querysActiveInDb(req, res);
    });

        // ======== Events E008 ========
    io.sockets.on('connection', function(socket) {

        var socket_id = socket.id;
        socket.on('onObtenerEstadisticasSistema', function(datos) {
            e_sistema.onObtenerEstadisticasSistema(socket_id, datos);
        });

        socket.on('disconnect', function(data) {
        });
    });
};
