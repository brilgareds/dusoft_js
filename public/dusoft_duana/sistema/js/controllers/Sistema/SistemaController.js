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
            $scope.promedio1Min = 0;
            $scope.promedio5Min = 0;
            $scope.promedio15Min = 0;
            $scope.promedioActual = 0;
            $scope.promedioTotal = 0;
            $scope.memory = {
                header: [],
                rows: []
            };
            $scope.hdd = {
                header: [],
                rows: []
            };

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

            socket.on("cpu216", function (datos) {
                if (datos.status === 200) {
                    console.log('Respuesta es: ', datos);
                    var cantidadLineas = datos.obj.length;
                    $scope.memory.header = datos.obj.memory.header;
                    $scope.memory.rows = datos.obj.memory.rows;
                    $scope.hdd.header = datos.obj.hdd.header;
                    $scope.hdd.rows = datos.obj.hdd.rows;
                    //$scope.header.unshift([]);
                    //console.log('Header is: ', $scope.header, '\n');
                    console.log('Ram is: ', $scope.memory, '\n');
                    console.log('HDD is: ', $scope.hdd, '\n');
                }
            });


            $scope.inicio = function (estado) {
                switch (estado) {
                    case 1:
                        that.sshJasper({estado: estado});
                        break;
                    case 2:
                        that.sshJasper({estado: estado});
                        break;
                    case 3:
                        that.sshJasper({estado: estado});
                        break;
                    case 4:
                        that.sshJasper({estado: estado});
//                        ,function(result){
//                              
//                              $scope.cpu = result.split("\n");
//                            });
                        break;
                }
            };

            that.sshJasper = function (parametros) {
                var obj = {
                    session: $scope.session,
                    data: {
                        estado: parametros.estado
                    }
                };

                Request.realizarRequest(API.LOGS.JASPER_REPORT, "POST", obj, function (data) {

                    if (data.status === 200) {

                    }
                });
            };


        }]);
});
