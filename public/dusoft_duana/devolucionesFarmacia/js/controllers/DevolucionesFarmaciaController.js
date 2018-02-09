define(["angular", "js/controllers", 'includes/slide/slideContent'], function (angular, controllers) {

    controllers.controller('DevolucionesFarmaciaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout", "$filter", "localStorageService", "$state", "DevolucionesFarmaciaService",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, DevolucionesFarmaciaService) {

                    var that = this;

                    that.init = function (callback) {
                        $scope.root = {};

                        $scope.tipoPedido = 0;
                        $scope.EmpresasProductos = [];
                        $scope.paginaactual = 1;
                        $scope.paginas = 0;
                        $scope.items = 0;
                        $scope.listarPedido = [];
                        $scope.listarProductoEmpresa = [];
                        $scope.ultima_busqueda = "";
                        $scope.listaEmpresas = [];
                        $scope.empresa_seleccion = '';
                        $scope.selectedEmpresa = '';
                        $scope.selectedCentro = '';
                        $scope.selectedBodega = '';
                        $scope.termino_busqueda = '';
                        $scope.termino = "";
                        callback();
                    };

                    that.buscarEmpresas = function (callback) {
                        
                        console.log("CONTROLLER front that.buscarEmpresas");
                        var obj = {
                            session: $scope.session
                        };
                        DevolucionesFarmaciaService.buscarEmpresas(obj, function (data) {
                            if (data.status === 200) {
                                console.log("Resultado ", data);
                                callback(data.obj.listarEmpresas);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
                    }





                    that.init(function () {
                        console.log("CONTROLLER front init");
                        that.buscarEmpresas(function (data) {
                            $scope.empresas = data;
                        });
                    });

                    /**
                     * +Descripcion: objeto ng-grid
                     * @author Andres M Gonzalez
                     * @fecha: 11/05/2016
                     * @returns {objeto}
                     */
                    $scope.lista_productos_empresa = {
                        data: 'listarPedido',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableHighlighting: true,
                        columnDefs: [
                            {field: 'opciones', displayName: "Estado Actual", cellClass: "txt-center dropdown-button", width: "10%",
                                cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.obtenerPedidoPorPosiscion(0).getBoolPorAprobar()" class="btn btn-warning btn-xs" >\
                                                    <i class="glyphicon glyphicon-warning-sign"></i>\n\
                                                        <span> Pendiente </span>\
                                                </button>\
                                                <button ng-if="!row.entity.obtenerPedidoPorPosiscion(0).getBoolPorAprobar()" class="btn btn-primary btn-xs" >\
                                                    <i class="glyphicon glyphicon-ok"></i>\
                                                    <span> Revisado </span>\
                                                </button>\
                                            </div>'
                            },
                            {field: 'getNombre()', displayName: 'Cliente / Farmacia', width: "65%"},
                            {field: 'obtenerPedidoPorPosiscion(0).get_numero_pedido()', displayName: 'Pedido', width: "10%"},
                            {field: 'obtenerPedidoPorPosiscion(0).getFechasolicitud()', displayName: 'Fecha', width: "10%"},
                            {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
                                cellTemplate: ' <div class="row">\n\
                                         <button class="btn btn-default btn-xs" disabled ng-disabled="row.entity.separado"  ng-click="onAbrirVentana(row.entity)">\n\
                                             <span class="glyphicon glyphicon-search"></span>\
                                         </button>\
                                       </div>'
                            }
                        ]

                    };





                }]);
});