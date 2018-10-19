
define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('FacturacionConsumoBarranquillaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho", "webNotification",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho, webNotification) {

                    var that = this;
                    $scope.notificarFacturaConsumo = 0;
                    /*
                     * Inicializacion de variables
                     * @param {type} empresa
                     * @param {type} callback
                     * @returns {void}
                     */
                    that.init = function (callback) {
                        $scope.paginaactual = 1;
                        $scope.columnaSizeBusqueda = "col-md-3";
                        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                        var fecha_actual = new Date();
                        $scope.root = {
                            termino_busqueda: '',
                            visibleBuscador: true,
                            visibleBotonBuscador: true,
                            fechaInicialPedidosCosmitet: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                            fechaFinalPedidosCosmitet: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                            opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                            vistaFacturacion: "",
                            facturasTemporales: "",
                            itemsFacturasTemporales: 0,
                            vistas: [
                                {
                                    id: 1,
                                    descripcion: "Facturas Generadas"
                                },
                                {
                                    id: 2,
                                    descripcion: "Facturas Temporales"
                                }
                            ],
                            estadoBotones: ["glyphicon glyphicon-edit",
                                "glyphicon glyphicon-ok",
                                "fa fa-spinner fa-spin",
                                "glyphicon glyphicon-remove"
                            ]
                        };
                        $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
                        $scope.session = {
                            usuario_id: Usuario.getUsuarioActual().getId(),
                            auth_token: Usuario.getUsuarioActual().getToken()
                        };
                        $scope.root.vistaSeleccionada = $scope.root.vistas[0];

                        callback();
                    };

                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
                    $scope.columnaSizeBusqueda = "col-md-3";

                    $scope.filtros = [
                        {tipo: 'id', descripcion: "Id"},
                        {tipo: 'Nombre', descripcion: "Nombre"}
                    ];
                    $scope.filtro = $scope.root.filtros[0];

                    $scope.onColumnaSize = function (tipo) {

                    };
                    /**
                     * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
                     *              el tipo de documento seleccionado
                     * @param {type} filtro
                     * @returns {undefined}
                     */
                    $scope.onSeleccionFiltro = function (filtro) {

                        $scope.filtro = filtro;
                        $scope.root.termino_busqueda = '';
                    };


                    $scope.buscarClienteFacturaTemporal = function (event) {

                        if (event.which === 13 || event.which === 1) {

                            that.listarFacturasTemporal();
                        }

                    };

                    /**
                     * @author Cristian Ardila
                     * @fecha 2017-08-25
                     * +Descripcion Metodo encargado de invocar el servicio que consultara  
                     *              las facturas en temporal
                     */
                    that.listarFacturasTemporal = function () {
                        $scope.notificarFacturaConsumo = 0;
                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_facturas_consumo_temporal: {
                                    filtro: $scope.filtro,
                                    terminoBusqueda: $scope.root.termino_busqueda,
                                    paginaActual: $scope.paginaactual

                                }
                            }
                        };

                        facturacionClientesService.listarConsumoBarranquillaTemporal(obj, function (data) {

                            if (data.status === 200) {
                                $scope.root.facturasTemporales = facturacionClientesService.renderCabeceraTmpFacturaConsumoBarranquilla(data.obj.listar_facturas_consumo_temporal);
                                $scope.root.itemsFacturasTemporales = data.obj.listar_facturas_consumo_temporal.length;
                            } else {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                        });


                    };

                    /**
                     * @author Cristian Ardila
                     * +Descripcion Grid que listara todos los temporales de las facturas
                     * @fecha 25/08/2017
                     */
                    $scope.listarConsumoBarranquillaTemporales = {
                        data: 'root.facturasTemporales',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [
                            {cellClass: "ngCellText", width: "5%", displayName: 'Id',
                                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}- {{row.entity.get_numero()}}</p></div>'},
                            {cellClass: "ngCellText", width: "18%", displayName: 'Nombre Corte',
                                cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarTerceros()[0].getTipoId()}}- {{row.entity.mostrarTerceros()[0].getId()}}: {{ row.entity.mostrarTerceros()[0].getNombre()}}</p></div>'},
                            {field: 'observaciones', cellClass: "ngCellText", width: "25%", displayName: 'Observacion'},
                            {field: 'fechaRegistro', cellClass: "ngCellText", width: "10%", displayName: 'F. Registro'},
                            {field: 'valorSubTotal', cellClass: "ngCellText", width: "12%", displayName: 'Sub Total'},
                            {field: 'valorTotal', cellClass: "ngCellText", width: "12%", displayName: 'Total'},
                            {displayName: "Opc", width: "8%",heigth: "6%", cellClass: "txt-center dropdown-button",
                                cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.getEstadoFacturacion() == 0">\
                                   <a href="javascript:void(0);" ng-click="detalleFacturaTemporal(row.entity)" class= "glyphicon glyphicon-edit"> Facturar </a>\
                                </li>\
                                <li ng-if="row.entity.getEstadoFacturacion() == 0">\
                                   <a href="javascript:void(0);" ng-click="btn_eliminar_temporal(row.entity)" class= "glyphicon glyphicon-trash"> Eliminar </a>\
                                </li>\
                                <li ng-if="row.entity.getEstadoFacturacion() == 1 ">\
                                   <a href="javascript:void(0);" ng-click="imprimirReporteFactura(row.entity)" class = "glyphicon glyphicon-print"> ver </a>\
                                </li>\
                           </ul>\
                      </div>'
                            },
                            {field: 'Estado facturacion', cellClass: "ngCellText", displayName: 'Estado facturacion',
                                cellTemplate: '<div class="col-xs-16 ">\
                                <p class="text-uppercase">{{row.entity.getDescripcionEstadoFacturacion()}}\
                                   <span ng-class="agregar_clase_facturacion(row.entity.getEstadoFacturacion())"></span>\
                                </p>\
                              </div>'}
                        ]
                    };

                    $scope.agregar_clase_facturacion = function (index) {
                        return $scope.root.estadoBotones[index];
                    };

                    $scope.btn_eliminar_temporal = function (entity) {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea eliminar el documento?</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

                                    $scope.confirmar = function () {
                                        $scope.eliminarFacturaTemporal(entity);
                                        $modalInstance.close();
                                    };
                                    $scope.close = function () {
                                        $modalInstance.close();
                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    $scope.onCambiarVista = function (vista) {
                        $scope.root.vistaFacturacion = vista;
                    };

                    $scope.onBtnGenearFactura = function () {
                        $state.go("GuardarFacturaConsumo");
                    };

                    /*
                     * funcion para paginar anterior
                     * @returns {lista datos}
                     */
                    $scope.paginaAnterior = function () {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                        that.listarFacturasTemporal();
                    };


                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function () {
                        $scope.paginaactual++;
                        that.listarFacturasTemporal();
                    };

                    
                    /**
                     * +Descripcion Metodo principal, el cual cargara el modulo
                     *              siempre y cuando se cumplan las restricciones
                     *              de empresa, centro de utilidad y bodega
                     */
                    that.init(function () {
                                    that.listarFacturasTemporal();                           
                    });

                }]);
});
