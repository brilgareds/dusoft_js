var Sistema = function (m_sistema, socket, e_sistema) {
    this.m_sistema = m_sistema;
    this.io = socket;
    this.e_sistema = e_sistema;
};

Sistema.prototype.listarLogs = function (req, res) {
    var args = req.body.data;

    fs.readdir('./public/logs', function (err, items) {
        res.send(G.utils.r(req.url, 'Listar logs de errores', 200, {archivos: items}));
    });

};

Sistema.prototype.listarLogsVersion = function (req, res) {
    var args = req.body.data;
    var pagina = req.body.data.pagina;

    this.m_sistema.listar_log_version(pagina, function (err, logs_version) {
        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_logs_version: {}}));

        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_logs_version: logs_version}));

        }
    });
};

Sistema.prototype.verificarSincronizacion = function (req, res) {

    this.m_sistema.ultima_version(function (err, versionDB) {
        if (err) {
            res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 500, err));

        } else {
            fs.readFile('./db_version/version', 'utf8', function (err, versionCodigo) {
                if (err) {
                    res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 500, err));

                } else {
                    var sincronizado = false;
                    if (versionDB == versionCodigo) {
                        sincronizado = true;
                    }
                    res.send(G.utils.r(req.url, 'Verificar sincronizacion DB', 200, {
                        sincronizado: sincronizado,
                        version_db: versionDB,
                        version_codigo: versionCodigo
                    }));

                }
            });
        }
    });
};

Sistema.prototype.jasperReport = function (req, res) {
    console.log('En "jasperReport"');
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    var retorno;
    res.send(G.utils.r(req.url, 'jasperReport', 200, {jasperReport: {}}));

    var parametros = {
        host: "duana@10.0.2.216",
        user: "duana",
        password: "301206."
    };

    parametros.sentencia="echo 301206. | sudo -S /opt/jasperreports-server-cp-6.2.1/./ctlscript_public.sh ";
    
    switch(args.estado){
        case 1: parametros.sentencia = parametros.sentencia+"status";
        break;
        case 2: parametros.sentencia = parametros.sentencia+"start";
        break;
        case 3: parametros.sentencia = parametros.sentencia+"stop";
        break;
        case 4:
               parametros.sentencia="echo 301206. | sudo -S free -m -h"; 
        break;
        case 5:
//               parametros.sentencia="node ./var/www/projects/eDusoft/development_production/dusoft-server/pm2_script.js"; 
               parametros.sentencia="bash /var/www/projects/eDusoft/development_production/dusoft-server/./andres.sh"; 
        break;
        case 6:
               parametros.sentencia="pm2 reload server"; 
        break;
        case 7:
               parametros.sentencia="pm2 resurrect"; 
        break;
    }

    G.Q.nfcall(__asistenteSSH, parametros).then(function (resultados) {
        var resultadoArray = {
            memory: {
                header: [],
                rows: []
            },
            hdd: {
                header: [],
                rows: []
            }
        };
        var lineas = resultados.split('\n');
        var cantidadLineas = lineas.length;
        var palabra = '';
        var palabrasFiltradas = [''];

        for (var i = 0; i < cantidadLineas; i++) {
            var palabras = lineas[i].split(' ');
            var cantidadPalabras = palabras.length;

            for (var j = 0; j < cantidadPalabras; j++) {
                if (palabras[j] !== '') {
                    palabra += palabras[j] + ' ';

                    if (!(i === 2 && j === 0) && !(i === 4 && j === 17)) { // En caso de "false" concatenará la palabra
                        palabra = palabra.trim();
                        if (i > 4 && j === 0) {
                            palabra = palabra + ':';
                        }
                        palabrasFiltradas.push(palabra);
                        palabra = '';
                    }
                }
            }
            if (palabrasFiltradas.length > 0) {
                if (i !== 5 && i !== 9) {
                    if (i === 0) {
                        resultadoArray.memory.header = palabrasFiltradas;
                    } else if (i < 4) {
                        resultadoArray.memory.rows.push(palabrasFiltradas);
                    } else if (i === 4) {
                        resultadoArray.hdd.header = palabrasFiltradas;
                    } else if (i > 4) {
                        resultadoArray.hdd.rows.push(palabrasFiltradas);
                    }
                    palabrasFiltradas = [];
                }
            }
        }

        retorno = {
            usuario: usuario,
            status: 200,
            result: resultadoArray,
            estado: args.estado
        };

        switch (args.estado) {
            case 1:
                retorno.funcion = "jasper216";
                break;
            case 2:
                retorno.funcion = "jasper216";
                break;
            case 3:
                retorno.funcion = "jasper216";
                break;
            case 4:
                retorno.funcion = "cpu216";
                break;
            case 5:
                retorno.funcion = "pm2216";
                break;
            case 6:
                retorno.funcion = "pm2216";
                break;
            case 7:
                retorno.funcion = "pm2216";
                break;
        }
        return true;

    }).then(function (result) {
        that.e_sistema.enviarInformacion(retorno);
    }).fail(function (err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, 'Error jasperReport', 500, {jasperReport: err}));
    }).done();
};

function __asistenteSSH(parametros, callback) {
    console.log("parametros ", parametros);
    var respuesta = "";
    var resp = false;
    var host = parametros.host;

    var seq = G.sequest.connect(host,{username : parametros.user, password : parametros.password});

    seq(parametros.sentencia, function (err, stdout) {
        console.log("respuesta:: ", stdout);
        if (err !== undefined) {
            callback(true, stdout);
        } else {
            callback(false, stdout);
        }
        seq.end() // will keep process open if you don't end it
    });

}

Sistema.$inject = ["m_sistema", "socket", "e_sistema"];
module.exports = Sistema;
