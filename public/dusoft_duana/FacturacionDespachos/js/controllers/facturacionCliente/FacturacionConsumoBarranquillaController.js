
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
                        $scope.paginaDetalle = 1;
                        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
                        $scope.root = {
                            termino_busqueda: '',
                            progresoArchivo: 0,
                            termino_busqueda_farmacia: '',
                            opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
                            nombre: "",
                            observacion: "",
                            itemsFacturasTemporales: 0,
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

                        callback();
                    };

                    $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";

                    $scope.filtros = [
                        {tipo: 'id', descripcion: "Id"},
                        {tipo: 'Nombre', descripcion: "Nombre"}
                    ];
                    $scope.filtro = $scope.root.filtros[0];

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

                    that.borrarVariables = function () {
                        $scope.root.termino_busqueda = '';
                        $scope.root.farmacia_seleccionada = [];
                        $scope.root.progresoArchivo = 0;
                        $scope.root.termino_busqueda_farmacia = '';
                        $scope.root.nombre = "";
                        $scope.root.observacion = "";
                    };

                    $scope.buscarClienteFacturaTemporal = function (event) {

                        if (event.which === 13 || event.which === 1) {

                            that.listarFacturasTemporal();
                        }

                    };

                    /**
                     * @author German Galvis
                     * @fecha 18/10/2018
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
                     * +Descripcion Metodo encargado de invocar el servicio que listara 
                     *              las farmacias
                     * @author German Galvis
                     * @fecha 18/10/2018
                     */
                    that.listarFarmacias = function () {

                        var usuario = Usuario.getUsuarioActual();

                        var obj = {
                            session: $scope.session,
                            data: {
                                listar_clientes: {
                                    filtro: 'Nombre', //$scope.root.filtro,
                                    terminoBusqueda: $scope.root.termino_busqueda_farmacia, //$scope.root.numero,
                                    empresaId: usuario.empresa.codigo,
                                    paginaActual: '-1'
                                }
                            }
                        };
                        facturacionClientesService.listarClientes(obj, function (data) {
                            if (data.status === 200) {
                                $scope.bodegas = facturacionClientesService.renderTerceroDespacho(data.obj.listar_clientes);
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });

                    };


                    /**
                     * @author German Galvis
                     * +Descripcion Grid que listara todos los temporales de las facturas
                     * @fecha 18/10/2018
                     */
                    $scope.listarConsumoBarranquillaTemporales = {
                        data: 'root.facturasTemporales',
                        enableColumnResize: true,
                        enableRowSelection: false,
                        enableCellSelection: true,
                        enableHighlighting: true,
                        columnDefs: [
                            {field: 'factura', cellClass: "ngCellText", width: "6%", displayName: 'No Factura'},
                            {field: 'id', cellClass: "ngCellText", width: "6%", displayName: 'Id'},
                            {field: 'nombre', cellClass: "ngCellText", width: "25%", displayName: 'Nombre Corte'},
                            {field: 'observaciones', cellClass: "ngCellText", width: "25%", displayName: 'Observacion'},
                            {field: 'fechaRegistro', cellClass: "ngCellText", width: "15%", displayName: 'F. Registro'},
                            {displayName: "Opc", width: "8%", heigth: "10%", cellClass: "txt-center dropdown-button",
                                cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.getEstadoFacturacion() == 0">\
                                   <a href="javascript:void(0);" ng-click="onBtnGenearFacturaPrueba(row.entity)" class= "glyphicon glyphicon-edit"> Facturar </a>\
                                </li>\
                                <li ng-if="row.entity.getEstadoFacturacion() == 0">\
                                   <a href="javascript:void(0);" ng-click="btn_eliminar_temporal(row.entity)" class= "glyphicon glyphicon-trash"> Eliminar </a>\
                                </li>\
                                <li>\
                                   <a href="javascript:void(0);" ng-click="verProductos(row.entity)" class = "glyphicon glyphicon-print"> ver </a>\
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


                    /**
                     * +Descripcion German Galvis
                     * @fecha 19/10/2018
                     * +Descripcion Metodo encargado de eliminar el temporal de facturacion
                     */
                    $scope.eliminarFacturaTemporal = function (entity) {

                        var obj = {
                            session: $scope.session,
                            data: {
                                empresaId: entity.empresaId,
                                grupo_id: entity.id
                            }
                        };

                        facturacionClientesService.eliminarGetDocTemporalBarranquilla(obj, function (data) {
                            if (data.status === 200) {
                                AlertService.mostrarMensaje("warning", data.msj);
                                that.listarFacturasTemporal();
                            }

                            if (data.status === 404) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }

                            if (data.status === 500) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                        });
                    };

                    /**
                     * +Descripcion scope del grid para cargar los productos
                     * @author German Galvis
                     * @fecha 22/10/2018
                     */
                    $scope.cargarProductos = function () {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/facturacionClientes/CargarProductosBarranquilla.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', 'API', 'facturacionClientesService', function ($scope, $modalInstance, API, facturacionClientesService) {


                                    $scope.opciones_archivo = new Flow();
                                    $scope.opciones_archivo.target = API.FACTURACIONCLIENTES.SUBIR_ARCHIVO;
                                    $scope.opciones_archivo.testChunks = false;
                                    $scope.opciones_archivo.singleFile = true;
                                    $scope.opciones_archivo.query = {
                                        session: JSON.stringify($scope.session)
                                    };
                                    $scope.cargar_archivo_plano = function ($flow) {

                                        $scope.opciones_archivo = $flow;
                                    };
                                    $scope.cerrar = function () {
                                        $modalInstance.close();
                                    };

                                    $scope.subir_archivo_plano = function () {

                                        var usuario = Usuario.getUsuarioActual();
                                        $scope.root.progresoArchivo = 2;

                                        $scope.opciones_archivo.opts.query.data = JSON.stringify({
                                            data: {
                                                nombre: $scope.root.nombre,
                                                observacion: $scope.root.observacion,
                                                tipo_id_tercero: $scope.root.farmacia_seleccionada.tipo_id_tercero,
                                                tercero_id: $scope.root.farmacia_seleccionada.id,
                                                empresa_id: usuario.empresa.codigo,
                                                centro_id: usuario.empresa.centroUtilidad.codigo,
                                                bodega_id: usuario.empresa.centroUtilidad.bodega.codigo

                                            }
                                        });
                                        $scope.opciones_archivo.upload();
                                    };

                                    $scope.respuesta_archivo_plano = function (file, message) {

                                        var data = (message !== undefined) ? JSON.parse(message) : {};

                                        if (data.status === 200) {

                                            AlertService.mostrarMensaje("warning", data.msj);

                                            $scope.root.productos_invalidos = data.obj.cargue_archivo.productos_invalidos;
                                            $scope.opciones_archivo.cancel();
                                            $scope.root.productosInvalidos = [];
                                            $scope.root.productosInvalidosSinRepetir;


                                            $scope.root.productos_invalidos.forEach(function (row) {

                                                $scope.root.productosInvalidos.push({codigo_producto: row.codigo_producto, mensajeError: row.mensajeError});

                                            });

                                            function removeDuplicates(originalArray, prop) {
                                                var newArray = [];
                                                var lookupObject = {};

                                                for (var i in originalArray) {
                                                    lookupObject[originalArray[i][prop]] = originalArray[i];
                                                }

                                                for (i in lookupObject) {
                                                    newArray.push(lookupObject[i]);
                                                }
                                                return newArray;
                                            }

                                            $scope.root.productosInvalidosSinRepetir = removeDuplicates($scope.root.productosInvalidos, "codigo_producto")

                                            if ($scope.root.productosInvalidosSinRepetir.length > 0) {
                                                $scope.opts = {
                                                    backdrop: true,
                                                    backdropClick: true,
                                                    dialogFade: false,
                                                    keyboard: true,
                                                    template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Listado Productos </h4>\
                                        </div>\
                                        <div class="modal-body row">\
                                            <div class="col-md-12">\
                                                <h4 >Lista Productos NO validos.</h4>\
                                                <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                                    <div class="list-group">\
                                                        <a ng-repeat="producto in root.productosInvalidosSinRepetir" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                            {{ producto.codigo_producto}} - {{ producto.mensajeError }}\
                                                        </a>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                        </div>',
                                                    scope: $scope,
                                                    controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                                                            $scope.close = function () {
                                                                $scope.root.progresoArchivo = 0;
                                                                $modalInstance.close();
                                                            };
                                                        }]
                                                };
                                                var modalInstance = $modal.open($scope.opts);
                                            }

                                            that.listarFacturasTemporal();
                                            that.borrarVariables();

                                        } else {
                                            AlertService.mostrarMensaje("warning", data.msj);
                                        }
                                    };

                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);


                    };

                    /**
                     * +Descripcion scope del grid para mostrar el detalle de las facturas
                     * @author German Galvis
                     * @fecha 19/10/2018
                     */
                    $scope.verProductos = function (datos) {

                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/facturacionClientes/listarProductosBarranquilla.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', 'facturacionClientesService', function ($scope, $modalInstance, facturacionClientesService) {


                                    /*
                                     * funcion para paginar anterior
                                     * @returns {lista datos}
                                     */
                                    $scope.paginaAnteriorDetalle = function () {
                                        if ($scope.paginaDetalle === 1)
                                            return;
                                        $scope.paginaDetalle--;
                                        that.listarDetalle();
                                    };


                                    /*
                                     * funcion para paginar siguiente
                                     * @returns {lista datos}
                                     */
                                    $scope.paginaSiguienteDetalle = function () {
                                        $scope.paginaDetalle++;
                                        that.listarDetalle();
                                    };


                                    /**
                                     * +Descripcion Metodo encargado de invocar el servicio que consulta
                                     *              el detalle de la factura
                                     * @author German Galvis
                                     * @fecha 19/10/2018 DD/MM/YYYY
                                     * @returns {undefined}
                                     */
                                    that.listarDetalle = function () {

                                        var obj = {
                                            session: $scope.session,
                                            data: {
                                                empresa_id: datos.empresaId,
                                                grupo_id: datos.id,
                                                paginaActual: $scope.paginaDetalle
                                            }
                                        };

                                        facturacionClientesService.listarProductos(obj, function (data) {

                                            if (data.status === 200) {

                                                $scope.root.listadoProductos = facturacionClientesService.renderProductoFacturas(data.obj.listarProductos);
                                            } else {
                                                $scope.root.listadoProductos = null;
                                            }

                                        });
                                    };


                                    that.listarDetalle();

                                    $scope.cerrar = function () {
                                        $modalInstance.close();
                                    };

                                    $scope.listaProductos = {
                                        data: 'root.listadoProductos',
                                        enableColumnResize: true,
                                        enableRowSelection: false,
                                        enableCellSelection: true,
                                        enableHighlighting: true,
                                        columnDefs: [
                                            {field: 'Codigo', width: "10%", displayName: 'Codigo', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCodigo()}}</p></div>'}, //
                                            {field: 'Producto', width: "30%", displayName: 'Producto', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},
                                            {field: 'Cantidad', width: "6%", displayName: 'Cantidad', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getCantidad()}}</p></div>'},
                                            {field: 'Lote', width: "8%", displayName: 'Lote', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getLote()}}</p></div>'},
                                            {field: 'Fecha Vencimiento', width: "12%", displayName: 'Fecha Vencimiento', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaVencimiento()}}</p></div>'},
                                            {field: 'Valor Unitario', width: "15%", displayName: 'Valor Unitario', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getValorUnitario()| currency:"$ "}}</p></div>'},
                                            {field: 'Iva', width: "4%", displayName: '% IVA', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getPorcentajeIva()}}</p></div>'},
                                            {field: 'Valor Total', width: "15%", displayName: 'Valor Total', cellClass: "ngCellText", cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTotalNota()| currency:"$ "}}</p></div>'}

                                        ]
                                    };
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);


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

                    $scope.onBtnGenearFacturaPrueba = function (entity) {
                        that.generarFacturaIndividual(entity);
                    };

                    that.generarFacturaIndividual = function (facturaEspecial) {
                        var pedido = {
                            tipo_id_tercero: facturaEspecial.tipo_id_tercero, //"NIT",
                            id: facturaEspecial.tercero_id, //"892200273",
                            facturaEspecial: facturaEspecial.id,
                            pedidos: [
                                {
                                    numero_cotizacion: 0,
                                    vendedor: [
                                        {
                                            tipo_id_tercero: "NIT",
                                            id: "830080649"
                                        }
                                    ]
                                }
                            ]
                        };

                        var parametros = {
                            pedido: pedido,
                            tipoIdTercero: facturaEspecial.tipo_id_tercero, //'NIT',
                            terceroId: facturaEspecial.tercero_id, //'892200273',
                            AlertService: AlertService,
                            documentoSeleccionados: [],
                            session: $scope.session,
                            terminoBusqueda: '',
                            empresaSeleccionada: $scope.root.empresaSeleccionada,
                            paginaactual: 1,
                            tipoPagoFactura: '1',
                            facturacionCosmitet: 0
                        };

                        facturacionClientesService.generarFacturaIndividualCompleta(parametros, function (data) {

                            /**
                             * +Descripcion si se genera la factura satisfacturiamente,
                             *              el sistema activara la vista que lista las facturas generadas
                             *              haciendo referencia a la factura reciente
                             */
                            if (data.status === 200) {
//                                localStorageService.add("listaFacturaDespachoGenerada",
//                                        {active: true,
//                                            datos: data.obj.generar_factura_individual[0],
//                                            mensaje: data.obj.resultado_sincronizacion_ws.resultado,
//                                            mensaje_factura: data.obj.resultado_sincronizacion_ws.parametros
//                                        }
//                                );
//                                $state.go('Despacho');
                                that.listarFacturasTemporal();
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                            if (data.status === 404) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                            if (data.status === 409) {
                                AlertService.mostrarMensaje("danger", data.msj);
                            }
                            if (data.status === 500) {
                                AlertService.mostrarMensaje("danger", data.msj);
                            }
                        });
                    };

                    /**
                     * +Descripcion Metodo principal, el cual cargara el modulo
                     *              siempre y cuando se cumplan las restricciones
                     *              de empresa, centro de utilidad y bodega
                     */
                    that.init(function () {
                        that.listarFacturasTemporal();
                        that.listarFarmacias();
                    });

                }]);
});
