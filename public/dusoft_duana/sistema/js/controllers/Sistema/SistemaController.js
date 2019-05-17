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
            const serverSize = 'col-xs-6 col-sm-6 col-md-6 col-lg-6 ';
            $scope.promedio1Min = 0;
            $scope.promedio5Min = 0;
            $scope.promedio15Min = 0;
            $scope.promedioActual = 0;
            $scope.promedioTotal = 0;
            $scope.monitorModulos = {};
            $scope.monitoreo = { servers: [] };

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

            // Creando Modulos
            $scope.monitorModulos.PC = {
                title: 'PC',
                width: serverSize,
                tableClass: 'tablePc',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-primary', disable: false, icono: 'glyphicon glyphicon-list-alt'}
                ],
                obj: []
            };
            $scope.monitorModulos.JASPER = {
                title: 'JasperServer',
                width: serverSize,
                tableClass: 'tablePc',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-primary', disable: false, icono: 'glyphicon glyphicon-list-alt'},
                    {title: 'Start', name: 'start', class: serverBtnSize + 'btn btn-primary', disable: false, icono: 'glyphicon glyphicon-play'},
                    {title: 'Stop', name: 'stop', class: serverBtnSize + 'btn btn-danger', disable: false, icono: 'glyphicon glyphicon-stop'}
                ],
                obj: []
            };
            $scope.monitorModulos.PM2 = {
                title: 'PM2',
                width: serverSize,
                tableClass: 'tablePc tableBorder cells-auto',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-primary', disable: false, icono: 'glyphicon glyphicon-list-alt'},
                    {title: 'Reload', name: 'reload', class: serverBtnSize + 'btn btn-primary', disable: false, icono: 'glyphicon glyphicon-refresh'},
                    {title: 'Resurrect', name: 'resurrect', class: serverBtnSize + 'btn btn-danger', disable: false, icono: 'glyphicon glyphicon-eject'}
                ],
                obj: []
            };

            // Funcion para crear Servidor con Modulos y Sockets
            $scope.crearServer = (server, Modulos) => {
                $scope.monitoreo[server] = {};
                $scope.monitoreo.servers.push(server);

                // Agregando Modulos al servidor
                if(Array.isArray(Modulos) && Modulos.length > 0) {
                    for (let Modulo of Modulos) {
                        if($scope.monitorModulos[Modulo] !== undefined
                            && Array.isArray(Modulos)
                            && $scope.monitoreo[server] !== undefined)
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
                            console.log('Error!!');
                            if ($scope.monitoreo[server] !== undefined) {
                                console.log('Servidor: '+ server +', no existe!!');
                            }
                            if ($scope.monitorModulos[Modulo] !== undefined) {
                                console.log('Modulo: '+ Modulo +', no existe!!');
                            }
                        }
                    }
                } else {
                    console.log('Error: formato incorrecto en array "Modulos"!!');
                }
            };

            // Creando servidores, Agregando Modulos y agregando Sockets
            $scope.crearServer(117, ['PC', 'PM2']); // Creando servidor 117
            // $scope.crearServer(191, ['PC', 'PM2']); // Creando servidor 191
            $scope.crearServer(216, ['PC', 'PM2', 'JASPER']); // Creando servidor 216
            $scope.crearServer(229, ['PC', 'PM2']); // Creando servidor 229

            // Funcion para la conexion por SSH con los servidores
            $scope.sshConnection = (modulo, accion, server) => {
                const obj = {
                    session: $scope.session,
                    data: {
                        accion: accion,
                        modulo: modulo,
                        server: server
                    }
                };
                $scope.post(API.LOGS.SSH, obj, data => {
                    if (data.status === 200) {
                        console.log('Repuesta 200');
                        if (modulo === 'PM2' && accion === 'reload') {
                            $scope.sshConnection(modulo, 'status', server);
                        }
                    }
                });
            };

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
