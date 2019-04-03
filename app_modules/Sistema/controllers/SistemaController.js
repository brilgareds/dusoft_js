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
    var accion = args.accion ;
    var modulo = args.modulo;
    var server = args.server;
    var usuario = req.session.user.usuario_id;
    var resultadoArray = [];
    var cantidadObjetos = 1;
    var urlJasper = '/opt/jasperreports-server-cp-6.2.1/./ctlscript_public.sh';
    // var urlPM2 = '/var/www/projects/eDusoft/development_production/dusoft-server/pm2_script.js';
    res.send(G.utils.r(req.url, 'jasperReport', 200, {jasperReport: {}}));

    console.log('Modulo es: ', modulo, '');

    if(server === 216){
        var credentialRoot = 'echo 301206. | sudo -S ';
        var parametros = {
            host: "10.0.2.216",
            user: "duana",
            password: "301206.",
            credentialSSH: 'echo 301206. | sudo -S '
        };
    }else if(server === 229){
        var credentialRoot = 'echo 301206. | sudo -S ';
        var parametros = {
            host: "10.0.2.229",
            user: "dusoft",
            password: "301206."
        };
    }

    var retorno = {
        usuario: usuario,
        status: '500',
        result: {},
        estado: accion,
        funcion: modulo.toLowerCase()+server
    }; // Comentario

    if(modulo === 'PC'){
        cantidadObjetos = 2;
        if(accion !== undefined){
            if(accion === 'status'){
                parametros.sentencia = 'free -m -h && df -h';
            }else{
                console.log('Error en modulo "PC", accion: '+ accion +' no existe!!');
            }
        }
    }else if(modulo === 'JASPER'){
        if(accion !== undefined && (accion === 'status' || accion === 'start' || accion === 'stop')){
            parametros.sentencia = credentialRoot + urlJasper + ' ' + accion;
        }else{
            console.log('Error en modulo "Jasper", accion: '+ accion +' no existe!!');
        }
    }else if(modulo === 'PM2'){
        if(accion !== undefined){
            if(accion === 'status'){
                parametros.sentencia = "pm2 status";
            }else if(accion === 'reload'){
                parametros.sentencia = "pm2 reload server";
            }else if(accion === 'resurrect'){
                parametros.sentencia = "pm2 resurrect";
            }else{
                console.log('Error en modulo "PM2", accion: '+ accion +' no existe!!');
            }
        }

    }

    G.Q.nfcall(__asistenteSSH, parametros).then(function (resultados) {
        var lineas = resultados.split('\n');
        var cantidadLineas = lineas.length;
        var palabrasFiltradas = [];
        var palabra = '';
        var headerDefault = ['App', 'Status'];

        for(var i = 0; i < cantidadObjetos; i++){  // Declarar propiedades del objeto a responder
            resultadoArray[i] = { header: [], title: modulo, rows: [] };
        }

        for (var j = 0; j < cantidadLineas; j++) {
            var palabras = lineas[j].split(' ');
            var cantidadPalabras = palabras.length;

            for (var k = 0; k < cantidadPalabras; k++) {
                palabras[k] = palabras[k].trim();
                if (palabras[k].length > 0) {
                    palabra += palabras[k] + ' '; // El espacio agregado es para luego poder concatenar

                    if(modulo === 'PC'){
                        if (!(j === 2 && k === 0) && !(j === 4 && k === 17)) { // En caso de "false" concatenará la palabra
                            palabra = palabra.trim();
                            if (j > 4 && k === 0) {
                                palabra = palabra + ':';
                            }
                            if(j === 0 && palabrasFiltradas.length === 0){
                                palabrasFiltradas.push('');
                            }
                            palabrasFiltradas.push(palabra);
                            palabra = '';
                        }
                    }else if(modulo === 'JASPER'){
                        if (k !== 1) { // En caso de "false" concatenará la palabra
                            palabra = palabra.trim();
                            if (k === 0) {
                                palabra = palabra + ':';
                            }
                            // console.log('Palabra ESSSSSS: ', palabra);
                            palabrasFiltradas.push(palabra);
                            palabra = '';
                        }
                    }
                }
            }

            if (palabrasFiltradas.length > 0) {
                if (modulo === 'PC') {
                    if (j !== 5 && j !== 9) { // En caso de false concatenará la fila actual con la fila proxima
                        if (j === 0) {
                            resultadoArray[0].title = 'Memoria Ram & Swap';
                            resultadoArray[0].header = palabrasFiltradas;
                        } else if (j < 4) {
                            resultadoArray[0].rows.push(palabrasFiltradas);
                        } else if (j === 4) {
                            resultadoArray[1].title = 'Disco Duro';
                            resultadoArray[1].header = palabrasFiltradas;
                        } else if (j > 4) {
                            resultadoArray[1].rows.push(palabrasFiltradas);
                        }
                        palabrasFiltradas = [];
                    }
                } else {
                    if (j === 0) {
                        resultadoArray[0].header = headerDefault;
                    }
                    resultadoArray[0].rows.push(palabrasFiltradas);
                    palabrasFiltradas = [];
                }

            }

        }
        retorno.status = 200;
        retorno.result = resultadoArray;

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
