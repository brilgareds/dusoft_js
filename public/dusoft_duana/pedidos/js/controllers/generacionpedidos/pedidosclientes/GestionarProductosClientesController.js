
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
        "ProductoPedidoCliente",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Producto, Sesion) {

            var that = this;

            $rootScope.$on('gestionar_productos_clientesCompleto', function(e, parametros) {

                $scope.datos_form = {
                    
                };
                
                that.buscar_productos();                
            });

            $rootScope.$on('cerrar_gestion_productos_clientesCompleto', function(e, parametros) {

                $scope.$$watchers = null;
            });


            // Productos 
            that.buscar_productos = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            centro_utilidad_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(),
                            termino_busqueda: '',
                            pagina_actual: 1
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_PRODUCTOS_CLIENTES, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
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
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "7%", enableCellEdit: false},
                    {field: 'getDescripcion()', displayName: 'Descripcion', enableCellEdit: false},
                    {field: 'get_codigo_cum()', displayName: 'CUM', width: "7%"},
                    {field: 'get_codigo_invima()', displayName: 'Invima', width: "7%"},
                    {field: 'get_fecha_vencimiento_invima()', displayName: 'Venc. Invima', width: "7%", cellFilter: "date:'dd/MM/yyyy'"},
                    {field: 'get_iva()', displayName: 'IVA', width: "5%"},
                    {field: 'get_precio_regulado()', displayName: '$ Regulado', width: "7%", cellFilter: "currency:'$ '"},
                    {field: 'get_precio_venta()', displayName: '$ Venta', width: "7%", cellFilter: "currency:'$ '",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'get_existencia()', displayName: 'Stock', width: "5%"},
                    {field: 'get_cantidad_disponible()', displayName: 'Dispo.', width: "5%"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-toolbar">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto(row)" ><span class="glyphicon glyphicon-lock"></span></button>\
                                            <button class="btn btn-default btn-xs" ng-click="solicitar_producto(row)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});