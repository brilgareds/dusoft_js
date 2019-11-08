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

const betweenDates = data => { // 2019-10-29 12:14:51.466269-05
    let response = '';
    const date1 = new Date(data);
    const date2 = new Date();
    let milisegundos = parseInt(date2 - date1);
    let dias = 0;
    let horas = 0;
    let minutos = 0;
    let segundos = 0;
    const formulaDia = 8.64e+7;
    const formulaHora = 3.6e+6;
    const formulaMinuto = 60000;
    const formulaSegundo = 1000;
    // console.log('Fechaaaa\nString: ' + data + ', Fecha1: ' + date1 + ' Fecha2: ' + date2 + ' Milisegundos: ' + milisegundos);

    if (milisegundos >= formulaDia) {
        dias = parseInt(milisegundos / formulaDia);
        milisegundos = milisegundos - (dias * formulaDia);
        response += dias + ' Dias, ';
    }

    if (milisegundos >= formulaHora) {
        horas = parseInt(milisegundos / formulaHora);
        milisegundos = milisegundos - (horas * formulaHora);
        response += horas + ' Horas, ';
    }

    if (milisegundos >= formulaMinuto) {
        minutos = parseInt(milisegundos / formulaMinuto);
        milisegundos = milisegundos - (minutos * formulaMinuto);
        response += minutos + ' Min, ';
    }

    if (milisegundos >= formulaSegundo) {
        segundos = parseInt(milisegundos / formulaSegundo);
        milisegundos = milisegundos - (segundos * formulaSegundo);
        response += segundos + ' Seg, ';
    }

    if (response === '') {
        segundos = '0,' + milisegundos.toString().substr(0, 1);
        response += segundos + ' Seg, ';
    }
    response = response.substr(0, response.length-2);

    return response;
};

const limpiarRespuesta = (lineas, modulo, accion) => {
    const cantidadLineas = lineas.length;
    let palabras = [];
    let palabra = '';
    let responseLineas = [];
    let responsePalabras = [];
    let cantidadPalabras = 0;
    let cantidadConsultas = 0;
    let todasLaspalabras = [];
    let responseObj = {};

    // console.log('\n\nLineas: ', lineas, '\n\n');

    if (modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') {
        if (accion === 'query') {
            responseObj.killQuery = true;
            cantidadConsultas = lineas[cantidadLineas-3].substr(1,1);
        } else if (accion === 'idles') {
            responseObj.killIdle = true;
        }
    }

    for (let j = 0; j < cantidadLineas; j++) {
        palabras = [];
        palabra = '';

        if (modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') {
            if (!lineas[j] || lineas[j].length < 4 || lineas[j].trim().substr(0, 4) === '----') continue;

            //console.log('La linea: ', lineas[j]);

            let initQuery = lineas[j].lastIndexOf(" | ")+1;
            const query = lineas[j].substr(initQuery+1).trim() || ' ';
            //console.log('La consulta: ', query);
            const part0 = lineas[j].substr(0, initQuery-1).trim();

            let initDate = part0.lastIndexOf(" | ")+1;
            const date = part0.substr(initDate+1).trim();
            const beforeDate = part0.substr(0, initDate-1).trim();

            let lineaDividida = beforeDate.trim().split(' ');
            lineaDividida.push(date.trim());
            lineaDividida.push(query);

            palabras = lineaDividida;
            /*for (let k = 0; k < lineaDividida.length; k++) {
                let word = lineaDividida[k];

                if (word && word.length) {
                    palabras.push(word);
                }
            }*/
        } else if (modulo !== 'POSTGRES_PRODUCCION' && modulo !== 'POSTGRES_PRUEBAS') {
            if (!lineas[j] || !lineas[j].length || !lineas[j].trim()) continue;

            palabras = lineas[j].split(' ');
        }

        cantidadPalabras = palabras.length;
        responsePalabras = [];

        for (let k = 0; k < cantidadPalabras; k++) {
            if (!palabras[k] || !palabras[k].length) { continue; }

            palabra = palabras[k].trim();
            // console.log('palabras: ', palabras);
            // console.log('palabras: ', palabras);
            /*let initQuery = lineaDividida.lastIndexOf(" | ")+1;
            let query = lineaDividida.substr(initQuery+1).trim();
            todasLaspalabras = lineaDividida.substr(0, initQuery-1).trim();*/


            if (palabra.length > 0 && palabra !== '│' && palabra !== '|' && palabra !== ' ') {
                if ((modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') && palabra.substr(0,1) === ':') {
                    palabra = palabra.substr(1).trim();
                    responsePalabras[responsePalabras.length-1] += palabra;

                } else if (palabra.length > 0 && palabra !== '│' && palabra !== '|' && palabra !== ' ' && palabra !== ' ') {
                    responsePalabras.push(palabra);
                } else {

                }
            } else {
                //console.log('No agregado nunca2: ' + palabra);
            }
        }

        if (responsePalabras.length > 1) {
            if ((modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') && (accion === 'query' || accion === 'idles') && responsePalabras[4] && responsePalabras[4] !== 'time') {
                //const time = responsePalabras[4].toString().trim().substr(0, 19);
                responsePalabras[4] = betweenDates(responsePalabras[4]);
            }
            // console.log('Array in this moment: ', responseLineas);
            responseLineas.push(responsePalabras);
            // console.log('Array After: ', responseLineas);
        } else if (j === cantidadLineas-3 && responsePalabras && responsePalabras.length === 1) {
            if (modulo === 'POSTGRES_PRODUCCION') {
                const isPlural = responsePalabras[0].substr(0, 2) !== '1 ';
                const positionNumber = isPlural ? (responsePalabras[0].length-6) : (responsePalabras[0].length-5);
                responseObj.countProcess = responsePalabras[0].substr(0, positionNumber);
            } else if (modulo === 'POSTGRES_PRUEBAS') {
                const isPlural = responsePalabras[0].substr(0, 2) !== '1 ';
                const positionNumber = isPlural ? (responsePalabras[0].length-7) : (responsePalabras[0].length-6);
                responseObj.countProcess = responsePalabras[0].substr(0, positionNumber);
            }
        } else {
            responseLineas.push(responsePalabras);
        }
    }
    const responseSsh = {
        rows: responseLineas,
        obj: responseObj
    };
    return responseSsh;
};

Sistema.prototype.querysActiveInDb = (req, res) => {

    let parametros = req.body.data;
    let funcion = parametros.action;
    let modulo = parametros.modulo;
    let server = parametros.server;
    let process = parametros.process;
    let response = [];

    G.Q.ninvoke(that.m_sistema, funcion, parametros)
        .then(rows => {
            response.push(rows);
            res.send(G.utils.r(req.url, 'Mostrando procesos de la base de datos', 200, response));


        }).catch(err => {
            console.log('Error: ', err);
            res.send(G.utils.r(req.url, err.msg, 500, {}));
        }).done();
};

const promesa = new Promise((resolve, reject) => { resolve(true); });

Sistema.prototype.sshConnection = (req, res) => {
    res.send(G.utils.r(req.url, 'sshConnection', 200, {sshConnection: {}}));
    let args = req.body.data;
    let accion = args.action;
    let modulo = args.modulo;
    let server = args.server;
    let usuario = req.session.user.usuario_id;
    let resultadoArray = [];
    let cantidadObjetos = 1;
    let credentialRoot = '';
    let parametros = {};
    let dusoft_directory = '';
    let buscar_dusoft = '';
    let urlJasper = '/opt/jasperreports-server-cp-6.2.1/./ctlscript_public.sh';
    // var urlPM2 = '/var/www/projects/eDusoft/development_production/dusoft-server/pm2_script.js';
    console.log('Modulo es: ', modulo, 'accion: ', accion); // Nombre del modulo

    if (server === 117) {
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.117",
            user: "duana",
            password: "301206."
        };
    } else if (server === 191) {
        dusoft_directory = '/media/datos/Proyectos/Dusoft_Angular/Duana';
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: '10.0.2.191',
            user: 'gabriel',
            password: '301206.'
        };
    } else if (server === 216) {
        dusoft_directory = '/home/dusoft-server';
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.216",
            user: "duana",
            password: "301206."
        };
    } else if (server === 229) {
        dusoft_directory = '/var/www/projects/eDusoft/development_production/dusoft-server';
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.229",
            user: "dusoft",
            password: "301206."
        };
    } else if (server === 117) {
        credentialRoot = 'echo 301206. | sudo -S ';
        parametros = {
            host: "10.0.2.117",
            user: "duana",
            password: "301206."
        };
    } else if (server === 246) {


        if (modulo === 'POSTGRES_PRUEBAS') {
            credentialRoot = 'PGPASSWORD=301206. psql -d dusoft_ago10 -U desarrollo -c';
            parametros = {
                host: "10.0.2.169",
                user: "root",
                password: "LagartoFantasma@2019"
            };
        } else if (modulo === 'POSTGRES_PRODUCCION') {
            credentialRoot = 'PGPASSWORD=.123mauro* psql -d dusoft -U admin -c';
            parametros = {
                host: "10.0.2.246",
                user: "root",
                password: "s1st3m_Du4na_r0ot2.4.6"
            };
        }
    }
    buscar_dusoft = 'cd ' + dusoft_directory;

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
        } else {
            console.log('Error en formato de "accion"!');
        }

    } else if (modulo === 'GIT') {
        if (accion !== undefined) {
            if (accion === 'status') {
                parametros.sentencia = buscar_dusoft + ' && git status';
            } else if (accion === 'logs') {
                if (server !== 216) {
                    parametros.sentencia = buscar_dusoft + " && git log --pretty=format:'Sha:%x09%h,%x09Msg:%x09\"%s\",%x09Author:%x09%an%x09(%ad)' --graph -100 --date=format:%d/%m/%Y\\ %H:%M:%S";
                } else {
                    parametros.sentencia = buscar_dusoft + " && git log --pretty=format:'Sha:%x09%h,%x09Msg:%x09\"%s\",%x09Author:%x09%an%x09(%ai)' --graph -100";
                }
            }
        } else {
            console.log('Error en formato de "accion"!');
        }
    } else if (modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') {
        // console.log('args: ', args);
        if (accion !== undefined) {
            let query = "";
            if (accion === 'query') {
                query = ` "SELECT procpid AS id, datname AS db, usename AS user, client_addr AS ip, query_start AS time, current_query AS query FROM pg_stat_activity WHERE not current_query ILIKE '%<IDLE>%' AND not current_query ILIKE '%from system_usuarios_sesiones%' AND not current_query ILIKE '%update system_usuarios_sesiones%' AND procpid != pg_backend_pid() ORDER BY query_start ASC;"`;
            } else if (accion === 'idles') {
                query = " \"SELECT procpid AS id, datname AS db, usename AS user, client_addr AS ip, query_start AS time, '<IDLE>' AS query FROM pg_stat_activity WHERE current_query = '<IDLE>' ORDER BY query_start ASC;\" ";
            } else if (accion === 'killProcess') {
                query = " \"SELECT pg_cancel_backend(procpid) AS dead FROM pg_stat_activity WHERE datname = '"+ args.process.db +"' AND procpid = "+ args.process.id +";\" ";
            } else if (accion === 'killProcess2') {
                query = " \"SELECT pg_terminate_backend(procpid) AS dead FROM pg_stat_activity WHERE datname = '"+ args.process.db +"' AND procpid = "+ args.process.id +" AND current_query = '<IDLE>';\" ";
            } else if (accion === 'killProcess3') {
                query = " \"SELECT pg_cancel_backend(procpid) AS dead FROM pg_stat_activity WHERE datname = '"+ args.process.db +"' AND current_query != '<IDLE>';\" ";
            } else if (accion === 'killProcess4') {
                query = " \"SELECT pg_terminate_backend(procpid) AS dead FROM pg_stat_activity WHERE datname = '"+ args.process.db +"' AND current_query = '<IDLE>';\" ";
            }
            parametros.sentencia = credentialRoot + query;
        } else {
            console.log('Error en formato de "accion"!');
        }
    }
    G.Q.nfcall(__asistenteSSH, parametros)
        .then(resultados => {
            let headerDefault = ['App', 'Status'];
            let palabrasFiltradas = [];
            let palabras = [];
            let palabra = '';
            let cantidadPalabras = 0;

            let sshResponse = limpiarRespuesta(resultados.split('\n'), modulo, accion);
            let lineas = sshResponse.rows;
            let objetoResponse = sshResponse.obj;

            // console.log('Lineasssss: ', lineas);
            const cantidadLineas = lineas.length;

            for (let i = 0; i < cantidadObjetos; i++) {  // Declarar propiedades del objeto a responder
                resultadoArray[i] = { header: [], title: modulo, rows: [], obj: objetoResponse };
            }

            for (let j = 0; j < cantidadLineas; j++) {
                palabras = lineas[j];
                cantidadPalabras = palabras.length;

                for (let k = 0; k < cantidadPalabras; k++) {
                    palabra += palabras[k] + ' '; // El espacio agregado es para luego poder concatenar
                    if (modulo === 'PC') {
                        if (!(server === 117 && (j === 3 && k === 5))
                            && !(server === 191 && (j === 3 && k === 5))
                            && !(server === 216 && ((j === 2 && k === 0) || (j === 4 && k === 5)))
                            && !(server === 229 && ((j === 2 && k === 0) || (j === 4 && k === 5))))
                        {   // En caso de "false" concatenará la palabra
                            palabra = palabra.trim();
                            if (((server === 117 && j > 3)
                                || (server === 191 && j > 3)
                                || (server === 216 && j > 4 && j !== 6 && j !== 10)
                                || (server === 229 && j > 4))
                                && k === 0)
                            { // Agrega dos puntos a la primera palabra de la linea 4
                                palabra = palabra + ':';
                            }
                            if (j === 0 && palabrasFiltradas.length === 0) {
                                palabrasFiltradas.push('');
                            }
                            palabrasFiltradas.push(palabra);
                            palabra = '';
                        }
                    } else if (modulo === 'JASPER') {
                        if (k !== 1) { // En caso de "false" concatenará la palabra
                            palabra = palabra.trim();
                            if (k === 0) { // Agrega dos puntos a la primera palabra de cada linea
                                palabra = palabra + ':';
                            }
                            palabrasFiltradas.push(palabra);
                            palabra = '';
                        }
                    } else if (modulo === 'PM2') {
                        if (accion === 'status') {
                            if (!(j === 1 && k === 0)
                                && !(j > 2 && k === 9)) {
                                palabrasFiltradas.push(palabra);
                                palabra = '';
                            }
                        } else if (accion === 'resurrect') {
                            if (!(j === 3 && k === 0) && !(j > 3 && k === 9)) {
                                palabrasFiltradas.push(palabra);
                                palabra = '';
                            }
                        }
                    } else if (modulo === 'GIT') {
                        if (k === cantidadPalabras - 1) { // En caso de "false" concatenará la palabra
                            palabra = palabra.trim();
                            palabrasFiltradas.push(palabra);
                            palabra = '';
                        }
                    }
                    /*else if (modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') {

                    }*/
                    else {
                        palabrasFiltradas.push(palabra.trim());
                        palabra = '';
                    }
                }

                if (palabrasFiltradas.length > 0) {
                    if (modulo === 'PC') {
                        // console.log('palabrasFiltradas: ', palabrasFiltradas, ' j: ', j);

                        if (!(server === 216 && j === 5)
                            && !(server === 216 && j === 9))
                        { // En caso de false concatenará la fila actual con la fila proxima
                            if (j === 0) {
                                resultadoArray[0].title = 'Memoria Ram & Swap';
                                resultadoArray[0].header = palabrasFiltradas;
                            } else if ((server === 117 && j < 3)
                                || (server === 191 && j < 3)
                                || (server === 216 && j < 4)
                                || (server === 229 && j < 4))
                            {
                                resultadoArray[0].rows.push(palabrasFiltradas);
                            } else if ((server === 117 && j === 3)
                                || (server === 191 && j === 3)
                                || (server === 216 && j === 4)
                                || (server === 229 && j === 4))
                            {
                                resultadoArray[1].title = 'Disco Duro';
                                resultadoArray[1].header = palabrasFiltradas;
                            } else if ((server === 117 && j > 3)
                                || (server === 191 && j > 3)
                                || (server === 216 && j > 4)
                                || (server === 229 && j > 4)) {
                                resultadoArray[1].rows.push(palabrasFiltradas);
                            }
                            palabrasFiltradas = [];
                        }
                    } else if (modulo === 'JASPER') {
                        if (j === 0) {
                            resultadoArray[0].header = headerDefault;
                        }
                        resultadoArray[0].rows.push(palabrasFiltradas);
                        palabrasFiltradas = [];
                    } else if (modulo === 'PM2') {
                        if ((j !== cantidadLineas-2) && (j !== cantidadLineas-1)) {
                            if (accion === 'status') {
                                if ((server === 117 && j === 1)
                                    || (server === 191 && j === 1)
                                    || (server === 216 && j === 1)
                                    || (server === 229 && j === 1))
                                {
                                    resultadoArray[0].header = palabrasFiltradas;
                                } else if ((server === 117 && (j > 2 && j !== 7 && j !== 8))
                                    || (server === 191 && (j > 2))
                                    || (server === 216 && (j > 2 && j !== 7 && j !== 8))
                                    || (server === 229 && (j > 2 && j !== 7 && j !== 8)))
                                {
                                    resultadoArray[0].rows.push(palabrasFiltradas);
                                }
                            } else if (accion === 'resurrect') {
                                if(j === 1) {
                                    palabrasFiltradas = [palabrasFiltradas.join(' ')];
                                    resultadoArray[0].title = palabrasFiltradas[0];
                                } else if (j === 3) {
                                    resultadoArray[0].header = palabrasFiltradas;
                                } else if (j > 4) {
                                    resultadoArray[0].rows.push(palabrasFiltradas);
                                }
                            }
                        }
                        palabrasFiltradas = [];
                    } else if (modulo === 'GIT' && accion === 'logs') {
                        if (j === 0) {
                            resultadoArray[0].title = 'Ultimos cambios:';
                            resultadoArray[0].header = [''];
                        }
                        resultadoArray[0].rows.push(palabrasFiltradas);
                        palabrasFiltradas = [];
                    } else if (modulo === 'POSTGRES_PRODUCCION' || modulo === 'POSTGRES_PRUEBAS') {
                        if (j === 0) {
                            const countProcess = objetoResponse.countProcess;
                            if (accion === 'query') {
                                resultadoArray[0].title = 'Consultas en proceso (' + countProcess + ')';
                            } else if (accion === 'idles') {
                                resultadoArray[0].title = 'Conexiones activas (' + countProcess + ')';
                            }
                            if (cantidadLineas !== 1) {
                                resultadoArray[0].header = palabrasFiltradas;
                            }
                        } else {
                            resultadoArray[0].rows.push(palabrasFiltradas);

                        }
                        palabrasFiltradas = [];
                    } else {
                        if (j === 0) {
                            resultadoArray[0].title = palabrasFiltradas[0];
                        } else if (j === 1) {
                            resultadoArray[0].header = palabrasFiltradas;
                        } else {
                            resultadoArray[0].rows.push([' ']);
                            resultadoArray[0].rows.push(palabrasFiltradas);
                        }
                        palabrasFiltradas = [];
                    }
                }
            }
            retorno.status = 200;
            retorno.result = resultadoArray;

            console.log('Header: ', resultadoArray[0].header);
            console.log('Rows: ', resultadoArray[0].rows);
            console.log('Obj: ', resultadoArray[0].obj);

            return true;
        }).then(result => {
            that.e_sistema.enviarInformacion(retorno);
        }).catch(err => {
            console.log("Error generado ", err);
        });
};

const __asistenteSSH = (parametros, callback) => {
    let host = parametros.user + '@' + parametros.host;
    let opts = { username: parametros.user, password: parametros.password };
    let seq = G.sequest.connect(host, opts);

    seq(parametros.sentencia, (err, response) => {
        if (err === undefined) {
            console.log("Respuesta: ", response); // Respuesta del servidor
            callback(false, response);
        } else {
            callback(err);
        }
        seq.end(); // will keep process open if you don't end it
    });
};

Sistema.$inject = ["m_sistema", "socket", "e_sistema"];
module.exports = Sistema;
