let that;

var Sistema = function (m_sistema, socket, e_sistema) {
    this.m_sistema = m_sistema;
    this.io = socket;
    this.e_sistema = e_sistema;
    that = this;
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

Sistema.prototype.jasperReport = (req, res) => {
    console.log('In controller "jasperReport"');
    res.send(G.utils.r(req.url, 'jasperReport', 200, {jasperReport: {}}));
    let args = req.body.data;
    let accion = args.accion;
    let modulo = args.modulo;
    let server = args.server;
    let usuario = req.session.user.usuario_id;
    let resultadoArray = [];
    let cantidadObjetos = 1;
    let credentialRoot = '';
    let parametros = {};
    let urlJasper = '/opt/jasperreports-server-cp-6.2.1/./ctlscript_public.sh';
    // var urlPM2 = '/var/www/projects/eDusoft/development_production/dusoft-server/pm2_script.js';
    // console.log('Modulo es: ', modulo, ''); // Nombre del modulo

    if (server === 216) {
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.216",
            user: "duana",
            password: "301206."
        };
    } else if (server === 229) {
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.229",
            user: "dusoft",
            password: "301206."
        };
    }

    let retorno = {
        usuario: usuario,
        status: '500',
        result: {},
        estado: accion,
        funcion: modulo.toLowerCase()+server
    };

    if (modulo === 'PC') {
        cantidadObjetos = 2;
        if (accion !== undefined) {
            if (accion === 'status'){
                parametros.sentencia = 'free -m -h && df -h';
            } else {
                console.log('Error en modulo "PC", accion: '+ accion +' no existe!!');
            }
        }
    } else if (modulo === 'JASPER') {
        if (accion !== undefined && (accion === 'status' || accion === 'start' || accion === 'stop')) {
            parametros.sentencia = credentialRoot + urlJasper + ' ' + accion;
        } else {
            console.log('Error en modulo "Jasper", accion: '+ accion +' no existe!!');
        }
    } else if (modulo === 'PM2') {
        if (accion !== undefined) {
            if (accion === 'status') {
                parametros.sentencia = "pm2 status";
            } else if (accion === 'reload') {
                parametros.sentencia = "pm2 reload server";
            } else if (accion === 'resurrect') {
                parametros.sentencia = "pm2 resurrect";
            } else {
                console.log('Error en modulo "PM2", accion: '+ accion +' no existe!!');
            }
        }

    }

    G.Q.nfcall(__asistenteSSH, parametros)
        .then(resultados => {
            let lineas = resultados.split('\n');
            let cantidadLineas = lineas.length;
            let palabrasFiltradas = [];
            let palabra = '';
            let headerDefault = ['App', 'Status'];

            for (let i = 0; i < cantidadObjetos; i++){  // Declarar propiedades del objeto a responder
                resultadoArray[i] = { header: [], title: modulo, rows: [] };
            }

            for (let j = 0; j < cantidadLineas; j++) {
                let palabras = lineas[j].split(' ');
                let cantidadPalabras = palabras.length;

                for (let k = 0; k < cantidadPalabras; k++) {
                    palabras[k] = palabras[k].trim();
                    if (palabras[k].length > 0) {
                        palabra += palabras[k] + ' '; // El espacio agregado es para luego poder concatenar
                        // console.log('J es: '+ j + ', K es: ' + k + ', palabra es: ', palabra); // Columna,linea y palabra

                        if (modulo === 'PC') {
                            if (!(j === 2 && k === 0)
                                && !(server === 216 && j === 4 && k === 17)
                                && !(server === 229 && j === 4 && k === 10))
                            {   // En caso de "false" concatenará la palabra
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
                        } else if (modulo === 'JASPER') {
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
                        if (!(server === 216 && j === 5)
                            && !(server === 216 && j === 9))
                        { // En caso de false concatenará la fila actual con la fila proxima
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
        }).then(result => {
            that.e_sistema.enviarInformacion(retorno);
        }).catch(err => {
            console.log("error generado ", err);
            // res.send(G.utils.r(req.url, 'Error jasperReport', 500, {jasperReport: err}));
        }).done();
};

function __asistenteSSH(parametros, callback) {
    var respuesta = "";
    var resp = false;
    var host = parametros.user + '@' + parametros.host;
    var seq = G.sequest.connect(host, {username: parametros.user, password: parametros.password});
    seq(parametros.sentencia, function (err, stdout) {
        console.log("respuesta: \n", stdout, '\n'); // Respuesta del servidor
        if (err !== undefined) {
            callback(stdout);
        } else {
            callback(false, stdout);
        }
        seq.end() // will keep process open if you don't end it
    });

}

Sistema.$inject = ["m_sistema", "socket", "e_sistema"];
module.exports = Sistema;
