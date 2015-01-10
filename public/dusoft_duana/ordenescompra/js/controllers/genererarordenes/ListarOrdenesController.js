
define(["angular", "js/controllers",
    "models/OrdenCompraPedido",
    "models/EmpresaOrdenCompra",
    "models/ProveedorOrdenCompra",
    "models/UnidadNegocio",
    "models/ProductoOrdenCompra",
    "models/NovedadOrdenCompra",
    "models/ObservacionOrdenCompra",
    "models/ArchivoNovedadOrdenCompra",
    "models/UsuarioOrdenCompra"
], function(angular, controllers) {

    controllers.controller('ListarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "ProductoOrdenCompra",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Producto, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };


            // numero de orden compra
            localStorageService.add("numero_orden", 0);

            // Vista Previa 
            localStorageService.add("vista_previa", '0'); //false

            // Variables
            var fecha_actual = new Date()
            $scope.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.fecha_final = $filter('date')(fecha_actual, "yyyy-MM-dd");

            $scope.orden_compra_seleccionada = '';
            $scope.mensaje_sistema = "";
            $scope.datepicker_fecha_final = false;

            // Variable para paginacion
            $scope.paginas = 0;
            $scope.cantidad_items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.pagina_actual = 1;




            $scope.buscar_ordenes_compras = function(termino, paginando) {

                var termino = termino || "";

                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            fecha_inicial: $filter('date')($scope.fecha_inicial, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.fecha_final, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: termino,
                            pagina_actual: $scope.pagina_actual
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_ORDENES_COMPRAS, "POST", obj, function(data) {

                    $scope.ultima_busqueda = $scope.termino_busqueda;

                    if (data.status === 200) {

                        $scope.cantidad_items = data.obj.ordenes_compras.length;

                        if (paginando && $scope.cantidad_items === 0) {
                            if ($scope.pagina_actual > 0) {
                                $scope.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };


            $scope.anular_orden_compra = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            numero_orden: $scope.orden_compra_seleccionada.get_numero_orden()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.ANULAR_ORDEN_COMPRA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {

                        $scope.orden_compra_seleccionada.set_estado('2');
                        $scope.orden_compra_seleccionada.set_descripcion_estado('Anulado');

                        $scope.orden_compra_seleccionada = '';
                    }
                });


            };

            that.render_ordenes_compras = function(ordenes_compras) {

                $scope.Empresa.limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);


                    orden_compra.set_proveedor(Proveedor.get(orden.tipo_id_proveedor, orden.nit_proveedor, orden.codigo_proveedor_id, orden.nombre_proveedor, orden.direccion_proveedor, orden.telefono_proveedor));

                    orden_compra.set_unidad_negocio(UnidadNegocio.get(orden.codigo_unidad_negocio, orden.descripcion_unidad_negocio, orden.imagen));

                    orden_compra.set_usuario(Usuario.get(orden.usuario_id, orden.nombre_usuario));

                    orden_compra.set_descripcion_estado(orden.descripcion_estado);

                    orden_compra.set_ingreso_temporal(orden.tiene_ingreso_temporal);

                    orden_compra.set_estado_digitacion(orden.estado_digitacion);

                    $scope.Empresa.set_ordenes_compras(orden_compra);

                });
            };

            $scope.buscador_ordenes_compras = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscar_ordenes_compras(termino_busqueda);
                }
            };

            $scope.lista_ordenes_compras = {
                data: 'Empresa.get_ordenes_compras()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_orden_compra', displayName: '# Orden', width: "5%"},
                    {field: 'proveedor.get_nombre()', displayName: 'Proveedor', width: "30%"},
                    {field: 'proveedor.direccion', displayName: 'Ubicacion', width: "25%"},
                    {field: 'proveedor.telefono', displayName: 'Telefono', width: "5%"},
                    {field: 'fecha_registro', displayName: "F. Registro", width: "7%"},
                    {field: 'descripcion_estado', displayName: "Estado"},
                    {field: 'estado_digitacion', displayName: "Digitacion"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="vista_previa(row.entity);" >Vista Previa</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,0)" >Modificar</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_acciones_orden_compra(row.entity,1)" >Novedades</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="javascript:void(0);" ng-click="anular_orden_compra_seleccionada(row.entity)">Anular OC</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            $scope.pagina_anterior = function() {
                $scope.pagina_actual--;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.pagina_siguiente = function() {
                $scope.pagina_actual++;
                $scope.buscar_ordenes_compras($scope.termino_busqueda, true);
            };

            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                
                $scope.datepicker_fecha_inicial = true;
                $scope.datepicker_fecha_final = false;

            };
            
            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                
                $scope.datepicker_fecha_inicial = false;
                $scope.datepicker_fecha_final = true;                               

            };

            $scope.crear_orden_compra = function() {
                localStorageService.add("numero_orden", 0);
                $state.go('OrdenCompra');
            };


            $scope.vista_previa = function(orden_compra) {

                localStorageService.add("numero_orden", orden_compra.get_numero_orden());
                localStorageService.add("vista_previa", '1'); // true
                $state.go('OrdenCompra');
            };


            $scope.gestionar_acciones_orden_compra = function(orden_compra, opcion) {

                // Opcion => 0 = Modificar
                // Opcion => 1 = Novedades


                if (orden_compra.estado === '0' || orden_compra.estado === '2' || orden_compra.get_ingreso_temporal()) {

                    if (orden_compra.estado === '0')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] ya fue Ingresada en bodega";
                    else if (orden_compra.estado === '2')
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] está anulada.";
                    else if (orden_compra.get_ingreso_temporal())
                        $scope.mensaje_sistema = "La Orden de Compra [ OC #" + orden_compra.get_numero_orden() + " ] esta siendo Ingresa en Bodega";

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
                                        <h4> {{ mensaje_sistema }} </h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-primary" ng-click="close()">Aceptar</button>\
                                    </div>',
                        scope: $scope,
                        controller: function($scope, $modalInstance) {

                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        },
                        resolve: {
                            mensaje_sistema: function() {
                                return $scope.mensaje_sistema;
                            }
                        }
                    };
                    var modalInstance = $modal.open($scope.opts);
                } else {

                    localStorageService.add("numero_orden", orden_compra.get_numero_orden());

                    if (opcion === 0)
                        $state.go('OrdenCompra');
                    else if (opcion === 1)
                        $state.go('Novedades');
                }

            };

            $scope.anular_orden_compra_seleccionada = function(orden_compra) {

                var template = "";
                var controller = "";

                $scope.orden_compra_seleccionada = orden_compra;


                if (orden_compra.estado === '1' && !orden_compra.get_ingreso_temporal()) {
                    // Anular
                    template = ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea Anular la OC #' + orden_compra.get_numero_orden() + '?? </h4> \
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="anular()" ng-disabled="" >Si</button>\
                                </div>';
                    controller = function($scope, $modalInstance) {

                        $scope.anular = function() {
                            $scope.anular_orden_compra();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };

                } else {
                    template = ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <h4> La orden de compra [OC #' + orden_compra.get_numero_orden() + '] no puede ser anulada !!.</h4>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button class="btn btn-primary" ng-click="close()">Aceptar</button>\
                                    </div>';
                    controller = function($scope, $modalInstance) {

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    };
                }


                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };
                var modalInstance = $modal.open($scope.opts);

            };

            $scope.buscar_ordenes_compras();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});