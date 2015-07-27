
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GestionarProductosClientesController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "Laboratorio",
        "ProductoPedidoCliente",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Laboratorio, Producto, Sesion) {

            var that = this;

            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {

                // Variables del View
                $scope.datos_form = {
                    clases_tipo_producto: ["", "label label-success", "label label-danger", "label label-info", "label label-warning", "label label-default"],
                    tipo_producto: '',
                    seleccion_tipo_producto: '- Todos -',
                    laboratorio: Laboratorio.get('',''),
                    paginando: false,
                    cantidad_items: 0,
                    termino_busqueda: "",
                    ultima_busqueda: "",
                    pagina_actual: 1
                };

                that.buscar_laboratorios();
                that.buscar_productos_clientes();
            });

            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {
                //$scope.datos_form = null;
                $scope.$$watchers = null;
            });

            // Laboratorios
            that.buscar_laboratorios = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        laboratorios: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_LABORATORIOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_laboratorios(data.obj.laboratorios);
                    }
                });
            };

            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();
                var laboratorio = Laboratorio.get("", "-- TODOS --");
                $scope.Empresa.set_laboratorios(laboratorio);
                laboratorios.forEach(function(data) {
                    laboratorio = Laboratorio.get(data.laboratorio_id, data.descripcion_laboratorio);
                    $scope.Empresa.set_laboratorios(laboratorio);
                });
            };

            $scope.seleccionar_laboratorio = function() {
                that.buscar_productos_clientes();
            };

            // Productos 
            $scope.seleccionar_tipo_producto = function(tipo_producto) {
                $scope.datos_form.tipo_producto = tipo_producto;
                $scope.datos_form.pagina_actual = 1;
                that.obtener_seleccion_tipo_producto();
                that.buscar_productos_clientes();
            };

            that.obtener_seleccion_tipo_producto = function() {

                $scope.datos_form.seleccion_tipo_producto = '';

                if ($scope.datos_form.tipo_producto === '')
                    $scope.datos_form.seleccion_tipo_producto = "- Todos -";
                if ($scope.datos_form.tipo_producto === '1')
                    $scope.datos_form.seleccion_tipo_producto = "- Normales -";
                if ($scope.datos_form.tipo_producto === '2')
                    $scope.datos_form.seleccion_tipo_producto = "- Alto Costo -";
                if ($scope.datos_form.tipo_producto === '3')
                    $scope.datos_form.seleccion_tipo_producto = "- Controlados -";
                if ($scope.datos_form.tipo_producto === '4')
                    $scope.datos_form.seleccion_tipo_producto = "- Insumos -";
                if ($scope.datos_form.tipo_producto === '5')
                    $scope.datos_form.seleccion_tipo_producto = "- Neveras -";
            };

            $scope.buscador_productos = function(ev) {
                if (ev.which === 13) {
                    that.buscar_productos_clientes();
                }
            };

            that.buscar_productos_clientes = function() {

                if ($scope.datos_form.ultima_busqueda !== $scope.datos_form.termino_busqueda) {
                    $scope.datos_form.pagina_actual = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(),
                            pagina_actual: $scope.datos_form.pagina_actual,
                            termino_busqueda: $scope.datos_form.termino_busqueda,
                            tipo_producto: $scope.datos_form.tipo_producto,
                            laboratorio_id: $scope.datos_form.laboratorio.get_id()
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_PRODUCTOS_CLIENTES, "POST", obj, function(data) {

                    $scope.datos_form.ultima_busqueda = $scope.datos_form.termino_busqueda;

                    if (data.status === 200) {

                        $scope.datos_form.cantidad_items = data.obj.pedidos_clientes.lista_productos.length;

                        if ($scope.datos_form.paginando && $scope.datos_form.cantidad_items === 0) {
                            if ($scope.datos_form.pagina_actual > 0) {
                                $scope.datos_form.pagina_actual--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_productos(data.obj.pedidos_clientes.lista_productos);
                    }
                });
            };

            that.render_productos = function(productos) {

                $scope.Empresa.limpiar_productos();

                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, data.existencia, data.iva, data.tipo_producto_id, data.estado);
                    producto.set_descripcion_tipo_producto(data.descripcion_tipo_producto);
                    producto.set_codigo_cum(data.codigo_cum).set_codigo_invima(data.codigo_invima).set_fecha_vencimiento_invima(data.vencimiento_codigo_invima);
                    producto.set_regulado(data.sw_regulado).set_precio_regulado(data.precio_regulado);
                    producto.set_pactado(data.tiene_precio_pactado).set_precio_venta(data.precio_producto);
                    producto.set_cantidad_disponible(data.cantidad_disponible);
                    $scope.Empresa.set_productos(producto);
                });
            };

            $scope.lista_productos = {
                data: 'Empresa.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "10%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-class="agregar_clase_tipo_producto(row.entity.tipo_producto)" >{{row.entity.get_abreviacion_tipo_producto()}}</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
                                        </div>'},
                    {field: 'getDescripcion()', displayName: 'Descripcion', enableCellEdit: false},
                    {field: 'get_codigo_cum()', displayName: 'CUM', width: "7%"},
                    {field: 'get_codigo_invima()', displayName: 'Invima', width: "7%"},
                    {field: 'get_fecha_vencimiento_invima()', displayName: 'Venc. Invima', width: "7%", cellFilter: "date:'dd/MM/yyyy'"},
                    {field: 'get_iva()', displayName: 'IVA', width: "5%"},
                    {field: 'get_precio_regulado()', displayName: '$ Regulado', width: "7%", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.es_regulado()" class="label label-red" >Reg.</span>\
                                            <span ng-cell-text class="pull-right" >{{COL_FIELD | currency}}</span>\
                                        </div>'},
                    {field: 'get_precio_venta()', displayName: '$ Venta', width: "7%", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.precio_venta" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_existencia()', displayName: 'Stock', width: "5%"},
                    {field: 'get_cantidad_disponible()', displayName: 'Dispo.', width: "5%"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button ng-if="row.entity.get_estado() == 0 " class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row)" ><span class="glyphicon glyphicon-lock"></span></button>\
                                            <button ng-if="row.entity.get_estado() == 1 " class="btn btn-default btn-xs" ng-click="solicitar_producto(row)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.agregar_clase_tipo_producto = function(tipo_producto) {
                return $scope.datos_form.clases_tipo_producto[tipo_producto];
            };

            $scope.pagina_anterior = function() {
                $scope.datos_form.paginando = true;
                $scope.datos_form.pagina_actual--;
                that.buscar_productos_clientes();
            };

            $scope.pagina_siguiente = function() {
                $scope.datos_form.paginando = true;
                $scope.datos_form.pagina_actual++;
                that.buscar_productos_clientes();
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});