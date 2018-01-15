var Sistema = function(m_sistema) {
    console.log("Modulo Sistema Cargado");
    this.m_sistema = m_sistema;
};

Sistema.prototype.listarLogs = function(req, res) {
    var args = req.body.data;

    fs.readdir('./public/logs', function(err, items) {
        res.send(G.utils.r(req.url, 'Listar logs de errores', 200, {archivos: items}));
    });

};

Sistema.prototype.listarLogsVersion = function(req, res) {
    var args = req.body.data;
    var pagina = req.body.data.pagina;

    this.m_sistema.listar_log_version(pagina, function(err, logs_version) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_logs_version: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_logs_version: logs_version}));
            return;
        }
    });
};

Sistema.prototype.verificarSincronizacion = function(req, res) {

    this.m_sistema.ultima_version(function(err, versionDB) {
        if (err) {
            res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 500, err));
            return;
        } else {
            fs.readFile('./db_version/version', 'utf8', function(err, versionCodigo) {
                if(err){
                    res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 500, err));
                    return;
                } else {
                    var sincronizado = false;
                    if (versionDB == versionCodigo){
                        sincronizado = true;
                    }
                    res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 200, {sincronizado : sincronizado, version_db : versionDB, version_codigo : versionCodigo}));
                    return;
                }
            });
        }
    });
};

Sistema.$inject = ["m_sistema"];
module.exports = Sistema;