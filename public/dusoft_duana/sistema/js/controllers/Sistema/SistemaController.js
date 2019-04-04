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

            var that = this;
            var serverBtnSize = 'col-xs-2 col-sm-2 col-md-2 col-lg-2 ';
            $scope.promedio1Min = 0;
            $scope.promedio5Min = 0;
            $scope.promedio15Min = 0;
            $scope.promedioActual = 0;
            $scope.promedioTotal = 0;
            $scope.monitorModulos = {};
            $scope.serverModulos216 = {};
            $scope.serverModulos216.modulos = [];
            $scope.serverModulos229 = {};
            $scope.serverModulos229.modulos = [];
            $scope.monitoreo = { servers: [] };

            $scope.crearServer = function(server){
                $scope.monitoreo[server] = {};
                $scope.monitoreo.servers.push(server);
            };

            $scope.agregarModulo = function(server, modulo){
                if($scope.monitorModulos[modulo] !== undefined && $scope.monitoreo[server] !== undefined){
                    if($scope.monitoreo[server].modulos === undefined){
                        $scope.monitoreo[server].modulos = [];
                    }
                    $scope.monitoreo[server].modulos.push(modulo);
                    $scope.monitoreo[server][modulo] = JSON.parse(JSON.stringify($scope.monitorModulos[modulo]));
                }else{
                    console.log('Error!!');
                    if($scope.monitoreo[server] !== undefined){
                        console.log('Servidor: '+ server +', no existe!!');
                    }
                    if($scope.monitorModulos[modulo] !== undefined){
                        console.log('Modulo: '+ modulo +', no existe!!');
                    }
                }
            };

            $scope.monitorModulos.PC = {
                title: 'PC',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-info', disable: false}
                ],
                obj: []
            };
            $scope.monitorModulos.JASPER = {
                title: 'JasperServer',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-info', disable: false},
                    {title: 'Start', name: 'start', class: serverBtnSize + 'btn btn-primary', disable: false},
                    {title: 'Stop', name: 'stop', class: serverBtnSize + 'btn btn-danger', disable: false}
                ],
                obj: []
            };
            $scope.monitorModulos.PM2 = {
                title: 'PM2',
                actions: [
                    {title: 'Status', name: 'status', class: serverBtnSize + 'btn btn-info', disable: false},
                    {title: 'Reload', name: 'reload', class: serverBtnSize + 'btn btn-primary', disable: false},
                    {title: 'Resurrect', name: 'resurrect', class: serverBtnSize + 'btn btn-danger', disable: false}
                ],
                obj: []
            };
            // Creando servidores
            $scope.crearServer(216); // Creando servidor 216
            $scope.crearServer(229); // Creando servidor 229
           
            $scope.crearServer(117); // Creando servidor 216
            
            // Agregando Modulos a los servidores
            $scope.agregarModulo(216, 'PC');
            $scope.agregarModulo(216, 'JASPER');
            $scope.agregarModulo(216, 'PM2');

            $scope.agregarModulo(229, 'PC');
            $scope.agregarModulo(229, 'PM2');
            
            $scope.agregarModulo(117, 'PC');
            $scope.agregarModulo(117, 'PM2');

            $scope.seleccion = Usuario.getUsuarioActual().getEmpresa();
            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

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

            // Socket del SERVER 216
            socket.on("pc216", function (datos) {
                console.log('pc216');
                if (datos.status === 200) { $scope.monitoreo[216].PC.obj = datos.obj; }
                
            });
            socket.on("jasper216", function (datos) {
                if (datos.status === 200) { $scope.monitoreo[216].JASPER.obj = datos.obj; }
            });
            socket.on("pm2216", function (datos) {
                if (datos.status === 200) { $scope.monitoreo[216].PM2.obj = datos.obj; }
            });

            // Socket del SERVER 229
            socket.on("pc229", function (datos) {
                console.log('pc229');
                if (datos.status === 200) { $scope.monitoreo[229].PC.obj = datos.obj; }
            });
            socket.on("jasper229", function (datos) {
                if (datos.status === 200) { $scope.monitoreo[229].JASPER.obj = datos.obj; }
            });
            socket.on("pm2229", function (datos) {
                if (datos.status === 200) { $scope.monitoreo[229].PM2.obj = datos.obj; }
            });
           
            socket.on("pc117", function (datos) {
                if (datos.status === 200) { $scope.monitoreo[117].PC.obj = datos.obj; }
            });
            socket.on("pm2117", function (datos) {
                console.log("Datos ",datos);
                if (datos.status === 200) { $scope.monitoreo[117].PM2.obj = datos.obj; }
            });

            $scope.sshConnection = function (modulo, accion, server) {
                var obj = {
                    session: $scope.session,
                    data: {
                        accion: accion,
                        modulo: modulo,
                        server: server
                    }
                };

                Request.realizarRequest(API.LOGS.JASPER_REPORT, "POST", obj, function (data) {
                    if (data.status === 200) {
                        console.log('Repuesta 200');
                    }
                });
            };
        }]);
});
