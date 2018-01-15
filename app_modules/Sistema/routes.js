module.exports = function(app, di_container) {
   
    var c_sistema = di_container.get('c_sistema');
    
    app.post('/api/Sistema/listarLogs', function(req, res) {
         c_sistema.listarLogs(req, res);
    });

    app.post('/api/Sistema/listarLogsVersion', function(req, res) {
         c_sistema.listarLogsVersion(req, res);
    });

    app.post('/api/Sistema/verificarSincronizacion', function(req, res) {
         c_sistema.verificarSincronizacion(req, res);
    });
};