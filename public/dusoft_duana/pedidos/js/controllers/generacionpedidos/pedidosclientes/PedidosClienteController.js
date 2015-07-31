
define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {

    controllers.controller('PedidosClienteController', [
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
        "$filter",
        "EmpresaPedidoCliente",
        "PedidoCliente",
        "ClientePedido",
        "VendedorPedidoCliente",
        "ProductoPedidoCliente",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Pedido, Cliente, Vendedor, Producto, Sesion) {

            var that = this;

            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Definicion Variables            
            $scope.Empresa = Empresa;

            // Inicializacion Pedido            
            $scope.Pedido = Pedido.get(
                    Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                    );

            $scope.Pedido.set_numero_cotizacion(parseInt(localStorageService.get("numero_cotizacion")) || 0);
            $scope.Pedido.set_vendedor(Vendedor.get()).setCliente(Cliente.get());
            $scope.Pedido.setFechaRegistro($filter('date')(new Date(), "dd/MM/yyyy"));

            $scope.datos_view = {
                termino_busqueda_clientes: '',
                termino_busqueda_productos: ''
            };

            // Consultas 
            that.gestionar_consultas_cotizaciones = function() {

                that.buscar_clientes(function(clientes) {
                    
                    if ($scope.Pedido.get_numero_cotizacion() > 0)
                        that.render_clientes(clientes);

                    that.buscar_vendedores(function() {

                        if ($scope.Pedido.get_numero_cotizacion() > 0) {

                            that.buscar_cotizacion(function() {

                                that.buscar_detalle_cotizacion();
                            });
                        }
                    });
                });
            };

            // Cotizacion
            that.buscar_cotizacion = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.CONSULTAR_COTIZACION, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_cotizacion(data.obj.pedidos_clientes.cotizacion[0]);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            that.render_cotizacion = function(data) {

                var cliente = Cliente.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                
                cliente.setDepartamento(data.departamento);
                cliente.setMunicipio(data.municipio);
                cliente.set_contrato(data.contrato_cliente_id);
                
                var vendedor = Vendedor.get(data.nombre_vendendor, data.tipo_id_vendedor, data.vendedor_id, data.telefono_vendedor);

                $scope.Pedido.set_vendedor(vendedor).setCliente(cliente);
                $scope.Pedido.set_observacion(data.observaciones);
                $scope.Pedido.set_tipo_producto(data.tipo_producto).set_descripcion_tipo_producto(data.descripcion_tipo_producto);
                $scope.Pedido.setFechaRegistro(data.fecha_registro);
            };
            
            // Detalle Cotizacion
            $scope.buscador_detalle_cotizacion = function(ev) {
                if (ev.which === 13) {
                    that.buscar_detalle_cotizacion();
                }
            };
            
            that.buscar_detalle_cotizacion = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido,
                            termino_busqueda : $scope.datos_view.termino_busqueda_productos        
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.CONSULTAR_DETALLE_COTIZACION, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_productos_cotizacion(data.obj.pedidos_clientes.lista_productos);
                    }
                });

            };

            that.render_productos_cotizacion = function(productos) {

                $scope.Pedido.limpiar_productos();

                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, 0, data.iva);
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);
                    producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.subtotal).set_valor_total_con_iva(data.total);

                    $scope.Pedido.set_productos(producto);
                });
            };


            // Clientes
            $scope.listar_clientes = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_clientes = termino_busqueda;

                that.buscar_clientes(function(clientes) {
                    that.render_clientes(clientes);
                });
            };

            that.buscar_clientes = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        clientes: {
                            empresa_id: $scope.Pedido.get_empresa_id(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_clientes,
                            paginacion: false
                        }
                    }
                };

                Request.realizarRequest(API.TERCEROS.LISTAR_CLIENTES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        callback(data.obj.listado_clientes);
                    }
                });
            };

            that.render_clientes = function(clientes) {

                $scope.Empresa.limpiar_clientes();

                clientes.forEach(function(data) {

                    var cliente = Cliente.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);

                    cliente.setDepartamento(data.departamento);
                    cliente.setMunicipio(data.municipio);
                    cliente.set_contrato(data.contrato_cliente_id);

                    $scope.Empresa.set_clientes(cliente);
                });
            };

            // Vendedores
            that.buscar_vendedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.TERCEROS.LISTAR_VENDEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_vendedores(data.obj.listado_vendedores);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            that.render_vendedores = function(vendedores) {

                $scope.Empresa.limpiar_vendedores();

                vendedores.forEach(function(data) {

                    var vendedor = Vendedor.get(data.nombre, data.tipo_id_vendedor, data.vendedor_id, data.telefono);

                    $scope.Empresa.set_vendedores(vendedor);
                });
            };


            // Ingresar Productos
            
            $scope.validacion_buscar_productos = function(){
                
                var disabled = false;
                
                if($scope.Pedido.getCliente().get_descripcion() === undefined || $scope.Pedido.getCliente().get_descripcion() === '')
                    disabled =  true;
                if($scope.Pedido.get_vendedor().get_descripcion() === undefined || $scope.Pedido.get_vendedor().get_descripcion() === '')
                    disabled =  true;
                if($scope.Pedido.get_observacion() === undefined || $scope.Pedido.get_observacion() === '')
                    disabled =  true;
                
                return disabled;
            };
            
            $scope.buscar_productos = function() {

                $scope.slideurl = "views/generacionpedidos/pedidosclientes/gestionarproductosclientes.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos_clientes');
            };

            $scope.cerrar_busqueda_productos = function() {

                $scope.$emit('cerrar_gestion_productos_clientes', {animado: true});
                
                that.gestionar_consultas_cotizaciones();
            };

            // Lista Productos Seleccionados
            $scope.lista_productos = {
                data: 'Pedido.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFooter: true,
                footerTemplate: '<div class="row col-md-12">\
                                    <div class="col-md-3 pull-right">\
                                        <table class="table table-clear">\
                                            <tbody>\
                                                <tr>\
                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                    <td class="right">{{ Pedido.get_subtotal() }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                    <td class="right">{{ planilla.get_valor_iva() }}</td>                                        \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total</strong></td>\
                                                    <td class="right">{{ planilla.get_total() }}</td>                                        \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "35%"},
                    {field: 'get_cantidad_solicitada()', displayName: 'Cant.', width: "8%"},
                    {field: 'get_iva()', displayName: 'I.V.A', width: "8%"},
                    {field: 'get_precio_venta()', displayName: 'Vlr. Unit', width: "10%", cellFilter:'currency : "$"'},
                    {field: 'get_valor_total_sin_iva()', displayName: 'Subtotal', width: "10%", cellFilter:'currency : "$"'},
                    {field: 'get_valor_total_con_iva()', displayName: 'Total', width: "10%", cellFilter:'currency : "$"'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs" ng-click="" ng-disabled="" ><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'
                    }
                ]
            };


            that.gestionar_consultas_cotizaciones();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                
                // Set Datas
                $scope.Empresa.set_default();         
                
                $scope.$$watchers = null;
            });
        }]);
});