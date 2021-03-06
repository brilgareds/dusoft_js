define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function (angular, controllers) {

    controllers.controller('SistemaController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa",
        function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {

            let that = this;
            const serverBtnSize = 'col-xs-3 col-sm-3 col-md-3 col-lg-2 ';
            const serverBtnSizeMedium = 'col-xs-6 col-sm-6 col-md-6 col-lg-5 ';
            const serverSizeMedium = 'col-xs-6 col-sm-6 col-md-6 col-lg-6 ';
            const serverSizeMax = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 ';
            $scope.promedio1Min = 0;
            $scope.promedio5Min = 0;
            $scope.promedio15Min = 0;
            $scope.promedioActual = 0;
            $scope.promedioTotal = 0;
            $scope.monitorModulos = {};
            $scope.monitoreo = { servers: [], serversName: [] };

            // Variables Globales
            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            // Funcion para realizar peticiones GET y POST
            $scope.get = (url, obj, callback) => {
                Request.realizarRequest(url, "GET", obj, data => callback(data) );
            };
            $scope.post = (url, obj, callback) => {
                Request.realizarRequest(url, "POST", obj, data => callback(data) );
            };

            // Funcion para la conexion por SSH con los servidores
            $scope.sshConnection = (modulo, action, server) => {
                console.log('Funcion "sshConnection"');
                const obj = {
                    session: $scope.session,
                    data: {
                        action,
                        modulo,
                        server
                    }
                };
                console.log('action is: ', action);
                $scope.post(API.LOGS.SSH, obj, data => {
                    if (data.status === 200) {
                        if (modulo === 'PM2' && btn.accion === 'reload') {
                            $scope.sshConnection(modulo, 'status', server);
                        }
                    }
                });
            };


            $scope.querysActiveInDb = (modulo, action, server, header = {}, process = {}) => {
                if (header && process) {
                    let rows = process;
                    process = {};

                    for (let row in rows) {
                        process[header[row]] = rows[row];
                    }
                }

                const obj = {
                    session: $scope.session,
                    data: {
                        action,
                        modulo,
                        server,
                        process
                    }
                };
                console.log('obj: ', obj);

                $scope.post(API.LOGS.SSH, obj, data => {
                    if (data.status === 200) {
                        if (action === 'killProcess') {
                            $scope.querysActiveInDb(modulo, 'query', server, header, process);
                        }
                        if (action === 'killProcess2') {
                            $scope.querysActiveInDb(modulo, 'idles', server, header, process);
                        }
                        if (action === 'querysActiveInDb') {
                            $scope.monitoreo[server][modulo].obj = data.obj;
                        }
                    } else {
                        console.log('Error: ', data.msj);
                        alert(data.msj);
                    }
                });
            };

            $scope.btnAccion = (modulo, btn, server) => {
                console.log('btn:, btn ');
                // currentAction: '';
                $scope[btn.btn_function](modulo, btn.name, server);
            };

            // Botones para los modulos
            let btn_sshStatusDefault = {
                title: 'Status',
                name: 'status',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-list-alt',
                btn_function: 'sshConnection'
            };
            let btn_sshGitLogs = {
                title: 'Logs',
                name: 'logs',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-align-left',
                btn_function: 'sshConnection'
            };
            let btn_dbStatusDefault = {
                title: 'Consultas en proceso',
                name: 'query',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-list-alt',
                btn_function: 'sshConnection'
            };
            let btn_dbIdlesDefault = {
                title: 'Conexiones Activas',
                name: 'idles',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-list-alt',
                btn_function: 'sshConnection'
            };
            let btn_killQuery = {
                title: 'Kill Query',
                name: 'killQuery',
                class: serverBtnSizeMedium + '',
                disable: false,
                icono: 'glyphicon glyphicon-refresh',
                btn_function: 'sshConnection'
            };
            btn_killQuery.htmlPersonalizado = true;

            let btn_reloadPM2 = {
                title: 'Reload',
                name: 'reload',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-refresh',
                btn_function: 'sshConnection'
            };
            let btn_resurrectPM2 = {
                title: 'Resurrect',
                name: 'resurrect',
                class: serverBtnSize + 'btn btn-danger',
                disable: false,
                icono: 'glyphicon glyphicon-eject',
                btn_function: 'sshConnection'
            };
            let btn_startDefault = {
                title: 'Start',
                name: 'start',
                class: serverBtnSize + 'btn btn-primary',
                disable: false,
                icono: 'glyphicon glyphicon-play',
                btn_function: 'sshConnection'
            };
            let btn_stopDefault = {
                title: 'Stop',
                name: 'stop',
                class: serverBtnSize + 'btn btn-danger',
                disable: false,
                icono: 'glyphicon glyphicon-stop',
                btn_function: 'sshConnection'
            };

            let btn_sshStatusDefaultDisabled = {
                title: 'Status',
                name: 'status',
                class: serverBtnSize + 'btn btn-primary',
                disable: true,
                icono: 'glyphicon glyphicon-list-alt',
                btn_function: 'sshConnection'
            };

            let btn_reloadPM2Disabled = {
                title: 'Reload',
                name: 'reload',
                class: serverBtnSize + 'btn btn-primary',
                disable: true,
                icono: 'glyphicon glyphicon-refresh',
                btn_function: 'sshConnection'
            };
            let btn_resurrectPM2Disabled = {
                title: 'Resurrect',
                name: 'resurrect',
                class: serverBtnSize + 'btn btn-danger',
                disable: true,
                icono: 'glyphicon glyphicon-eject',
                btn_function: 'sshConnection'
            };

            // Creando Modulos
            $scope.monitorModulos.PC = {
                title: 'PC',
                width: serverSizeMedium,
                tableClass: 'tablePc line-normal',
                actions: [
                    btn_sshStatusDefault
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.JASPER = {
                title: 'JasperServer',
                width: serverSizeMedium,
                tableClass: 'tablePc line-normal',
                actions: [
                    btn_sshStatusDefault,
                    btn_startDefault,
                    btn_stopDefault
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.PM2 = {
                title: 'PM2',
                width: serverSizeMedium,
                tableClass: 'tablePc tableBorder cells-auto line-normal',
                actions: [
                    btn_sshStatusDefault,
                    btn_reloadPM2,
                    btn_resurrectPM2
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.PM2_DISABLED = {
                title: 'PM2',
                width: serverSizeMedium,
                tableClass: 'tablePc tableBorder cells-auto line-normal',
                actions: [
                    btn_sshStatusDefaultDisabled,
                    btn_reloadPM2Disabled,
                    btn_resurrectPM2Disabled
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.POSTGRES_PRODUCCION = {
                title: 'PRODUCCIÓN (10.0.2.246)',
                width: serverSizeMax,
                //serverDefault: 246,
                tableClass: 'tablePc tableBorder cells-auto line-nowrap',
                actions: [
                    btn_dbStatusDefault,
                    btn_dbIdlesDefault
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.POSTGRES_PRUEBAS = {
                title: 'PRUEBAS (10.0.2.169)',
                width: serverSizeMax,
                // serverDefault: 169,
                tableClass: 'tablePc tableBorder cells-auto line-nowrap',
                actions: [
                    btn_dbStatusDefault,
                    btn_dbIdlesDefault
                ],
                currentAction: '',
                obj: []
            };
            $scope.monitorModulos.GIT = {
                title: 'GIT',
                width: serverSizeMax,
                tableClass: 'tablePc',
                actions: [
                    btn_sshStatusDefault,
                    btn_sshGitLogs
                ],
                currentAction: '',
                obj: []
            };

            // Funcion para crear Servidor con Modulos y Sockets
            $scope.crearServer = (server, Modulos) => {
                $scope.monitoreo[server] = {};
                $scope.monitoreo.servers.push(server);

                if (server === 117) {
                    $scope.monitoreo.serversName[server] = 'Server ' + server + ' (Servidor de Imagenes)';
                } else if (server === 191) {
                    $scope.monitoreo.serversName[server] = 'Server ' + server + ' (Test)';
                } else if (server === 216) {
                    $scope.monitoreo.serversName[server] = 'Server ' + server + ' (Dusoft #1)';
                } else if (server === 229) {
                    $scope.monitoreo.serversName[server] = 'Server ' + server + ' (Dusoft #2)';
                } else if (server === 246) {
                    $scope.monitoreo.serversName[server] = 'Postgresql';
                } else {
                    $scope.monitoreo.serversName[server] = 'Server ' + server;
                }

                // Agregando Modulos al servidor
                if(Array.isArray(Modulos) && Modulos.length > 0) {
                    for (let Modulo of Modulos) {
                        if($scope.monitorModulos[Modulo] !== undefined)
                        {
                            if($scope.monitoreo[server].modulos === undefined) {
                                $scope.monitoreo[server].modulos = [];
                            }
                            $scope.monitoreo[server].modulos.push(Modulo);
                            $scope.monitoreo[server][Modulo]=JSON.parse(JSON.stringify($scope.monitorModulos[Modulo]));

                            // Crear Socket
                            const modulo = Modulo.toLowerCase();
                            const nombreSocket = modulo+server;
                            socket.on(nombreSocket, datos => {
                                if (datos.status === 200) $scope.monitoreo[server][Modulo].obj = datos.obj;
                            });
                        } else {
                            console.log('Modulo: '+ Modulo +', no existe!!');
                        }
                    }
                } else {
                    console.log('Error: formato incorrecto en array "Modulos"!!');
                }
            };

            // Creando servidores, Agregando Modulos y agregando Sockets
            $scope.crearServer(246, ['POSTGRES_PRODUCCION', 'POSTGRES_PRUEBAS']); // Creando servidor 246
            $scope.crearServer(117, ['PC', 'PM2']); // Creando servidor 117
            $scope.crearServer(191, ['PC', 'PM2', 'GIT']); // Creando servidor 191
            $scope.crearServer(216, ['PC', 'PM2', 'JASPER', 'GIT']); // Creando servidor 216
            $scope.crearServer(229, ['PC', 'PM2_DISABLED', 'GIT']); // Creando servidor 229

            // Variables y funciones para Estadistica de Memoria
            $scope.datosGrafico = [{
                "key": "Uso de Memoria",
                "values": []
            }];

            var dta = [{key: "Uso de Memoria", values: []}];
            var counter = 0;
            //Se piden los datos para mostrar en el grafico de memoria y la tabla de peticiones.
            setInterval(function () {
                socket.emit('onObtenerEstadisticasSistema', function (datos) {
                });
            }, 30000);
            //Se obtienen los datos para mostrar en el grafico de memoria y la tabla de peticiones.
            socket.on('OnEstadisticaSistema', function (datos) {
                if (datos.status === 200) {
                    counter += 3;
                    $scope.memoria = datos.obj.memoria;
                    dta[0].values.push([counter, datos.obj.memoria]);
                    //en la grafica de uso de memoria se mostraran los ultimos 20 valores obtenidos
                    if (dta[0].values.length > 20) {
                        dta[0].values.splice(0, 1);
                    }
                    var values = dta[0].values.map(function (d) {
                        return [d[0], d[1]];
                    });
                    $scope.datosGrafico[0].values = values;
                    //fija los valores de la tabla de peticiones
                    $scope.promedio1Min = datos.obj.peticiones.requestsPerSecond["1MinuteRate"];
                    $scope.promedio5Min = datos.obj.peticiones.requestsPerSecond["5MinuteRate"];
                    $scope.promedio15Min = datos.obj.peticiones.requestsPerSecond["15MinuteRate"];
                    $scope.promedioActual = datos.obj.peticiones.requestsPerSecond.currentRate;
                    $scope.promedioTotal = datos.obj.peticiones.requestsPerSecond.mean;
                }
            });

            $scope.xFunction = function () {
                return function (d) {
                    return d.x;
                };
            };

            $scope.yFunction = function () {
                return function (d) {
                    return d.y;
                };
            };

            $scope.descriptionFunction = function () {
                return function (d) {
                    return d.key;
                };
            };

            $scope.toolTipContentFunction = function () {
                return function (key, x, y, e, graph) {
                    return '<h4>' + key + '</h4>' +
                        '<p>' + y + ' en ' + x + '</p>';
                };
            };

            $scope.xAxisTickFormatFunction = function () {
                return function (d) {
                    return d3.time.format('%x-%H:%M')(new Date(d * 1000));
                };
            };
        }]);
});
