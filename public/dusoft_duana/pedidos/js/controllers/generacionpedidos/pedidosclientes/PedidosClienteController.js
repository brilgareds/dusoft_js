
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

            // Definicion Variables Contenedora           
            $scope.Empresa = Empresa;

            // Definicion variables del View
            $scope.datos_view = {
                termino_busqueda_clientes: '',
                termino_busqueda_productos: '',
                activar_tab: {tab_productos: true, tab_cargar_archivo: false},
                producto_seleccionado: Producto.get(),
                cartera: (localStorageService.get("cartera") === '1') ? true : false
            };

            // Inicializacion Pedido o cotizacion           
            $scope.Pedido = Pedido.get(
                    Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                    );

            $scope.Pedido.set_vendedor(Vendedor.get()).setCliente(Cliente.get());
            $scope.Pedido.setFechaRegistro($filter('date')(new Date(), "dd/MM/yyyy"));

            if (localStorageService.get("cotizacion")) {
                var cotizacion = localStorageService.get("cotizacion");
                $scope.Pedido.set_numero_cotizacion(parseInt(cotizacion.numero_cotizacion) || 0);
                $scope.datos_view.cartera = (cotizacion.cartera === '1') ? true : false;
            } else {
                var pedido = localStorageService.get("pedido");
                $scope.Pedido.setNumeroPedido(parseInt(pedido.numero_pedido) || 0);
                $scope.datos_view.cartera = (pedido.cartera === '1') ? true : false;
            }

            // Consultas Cotizaciones
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

            // Consultas Pedidos
            that.gestionar_consultas_pedidos = function() {

                that.buscar_clientes(function(clientes) {

                    if ($scope.Pedido.get_numero_pedido() > 0)
                        that.render_clientes(clientes);

                    that.buscar_vendedores(function() {

                        if ($scope.Pedido.get_numero_pedido() > 0) {

                            that.buscar_pedido(function() {
                                that.buscar_detalle_pedido();
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
                $scope.Pedido.set_aprobado_cartera(data.sw_aprobado_cartera).set_observacion_cartera(data.observacion_cartera);
                $scope.Pedido.set_estado_cotizacion(data.estado).set_descripcion_estado_cotizacion(data.descripcion_estado);
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
                            termino_busqueda: $scope.datos_view.termino_busqueda_productos
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
                    producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.subtotal).set_valor_iva(data.valor_iva).set_valor_total_con_iva(data.total);

                    $scope.Pedido.set_productos(producto);
                });
            };


            // Pedidos 

            that.buscar_pedido = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            pedido: $scope.Pedido
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.CONSULTAR_PEDIDO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_pedido(data.obj.pedidos_clientes.pedido[0]);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };

            that.render_pedido = function(data) {

                var cliente = Cliente.get(data.nombre_cliente, data.direccion_cliente, data.tipo_id_cliente, data.identificacion_cliente, data.telefono_cliente);
                cliente.set_contrato(data.contrato_cliente_id);
                /*cliente.setDepartamento(data.departamento);
                 cliente.setMunicipio(data.municipio);
                 */

                var vendedor = Vendedor.get(data.nombre_vendedor, data.tipo_id_vendedor, data.idetificacion_vendedor/*, data.telefono_vendedor*/);

                $scope.Pedido.set_vendedor(vendedor).setCliente(cliente);
                $scope.Pedido.set_observacion(data.observacion);
                $scope.Pedido.set_tipo_producto(data.tipo_producto).set_descripcion_tipo_producto(data.descripcion_tipo_producto);
                $scope.Pedido.set_aprobado_cartera(data.sw_aprobado_cartera).set_observacion_cartera(data.observacion_cartera);
                $scope.Pedido.setFechaRegistro(data.fecha_registro);
            };

            that.buscar_detalle_pedido = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            pedido: $scope.Pedido,
                            termino_busqueda: $scope.datos_view.termino_busqueda_productos
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.CONSULTAR_DETALLE_PEDIDO, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_productos_pedidos(data.obj.pedidos_clientes.lista_productos);
                    }
                });

            };

            that.render_productos_pedidos = function(productos) {

                $scope.Pedido.limpiar_productos();

                productos.forEach(function(data) {

                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, 0, data.porcentaje_iva);
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);
                    producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.valor_unitario * data.cantidad_solicitada);
                    producto.set_valor_iva(data.valor_iva).set_valor_total_con_iva(data.valor_unitario_con_iva * data.cantidad_solicitada);

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


            // Productos

            $scope.validacion_buscar_productos = function() {

                var disabled = false;

                // Validaciones Generales
                if ($scope.Pedido.getCliente().get_descripcion() === undefined || $scope.Pedido.getCliente().get_descripcion() === '')
                    disabled = true;
                if ($scope.Pedido.get_vendedor().get_descripcion() === undefined || $scope.Pedido.get_vendedor().get_descripcion() === '')
                    disabled = true;
                if ($scope.Pedido.get_observacion() === undefined || $scope.Pedido.get_observacion() === '')
                    disabled = true;

                // Validaciones para la cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    if ($scope.Pedido.get_aprobado_cartera() === '1')
                        disabled = true;
                }

                return disabled;
            };

            $scope.buscar_productos = function() {

                $scope.slideurl = "views/generacionpedidos/pedidosclientes/gestionarproductosclientes.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos_clientes');
            };

            $scope.cerrar_busqueda_productos = function() {

                $scope.$emit('cerrar_gestion_productos_clientes', {animado: true});

                //that.gestionar_consultas_cotizaciones();
                that.init();
            };

            $scope.habilitar_eliminacion_producto = function() {

                var disabled = false;

                // Validaciones Cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    if ($scope.datos_view.cartera || $scope.Pedido.get_aprobado_cartera() === '1')
                        disabled = true;
                }

                // Validaciones Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {

                }

                return disabled;
            };

            $scope.confirmar_eliminar_producto = function(producto) {

                $scope.datos_view.producto_seleccionado = producto;

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea eliminar el producto?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Codigo.</h4>\
                                    <h5> {{ datos_view.producto_seleccionado.getCodigoProducto() }}</h5>\
                                    <h4>Descripcion.</h4>\
                                    <h5> {{ datos_view.producto_seleccionado.getDescripcion() }} </h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };

                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.eliminar_producto = function() {

                var obj = {};
                var url = '';

                // Cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    url = API.PEDIDOS.CLIENTES.ELIMINAR_PRODUCTO_COTIZACION;
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                cotizacion: $scope.Pedido,
                                producto: $scope.datos_view.producto_seleccionado
                            }
                        }
                    };
                }

                // Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {

                    url = API.PEDIDOS.CLIENTES.ELIMINAR_PRODUCTO_PEDIDO;
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                pedido: $scope.Pedido,
                                producto: $scope.datos_view.producto_seleccionado
                            }
                        }
                    };
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);
                    $scope.datos_view.producto_seleccionado = Producto.get();

                    if (data.status === 200) {
                        if ($scope.Pedido.get_numero_cotizacion() > 0)
                            that.buscar_detalle_cotizacion();
                        if ($scope.Pedido.get_numero_pedido() > 0)
                            that.gestionar_consultas_pedidos();
                    }
                });
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
                                                    <td class="left"><strong>Cnt. Productos</strong></td>\
                                                    <td class="right">{{ Pedido.get_productos().length  }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                    <td class="right">{{ Pedido.get_subtotal() | currency : "$" }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                    <td class="right">{{ Pedido.get_valor_iva() | currency : "$" }}</td>                                        \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total</strong></td>\
                                                    <td class="right">{{ Pedido.get_total() | currency : "$" }}</td>                                        \
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
                    {field: 'get_precio_venta()', displayName: 'Vlr. Unit', width: "10%", cellFilter: 'currency : "$"'},
                    {field: 'get_valor_total_sin_iva()', displayName: 'Subtotal', width: "10%", cellFilter: 'currency : "$"'},
                    {field: 'get_valor_total_con_iva()', displayName: 'Total', width: "10%", cellFilter: 'currency : "$"'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs" ng-click="confirmar_eliminar_producto(row.entity)" ng-disabled="habilitar_eliminacion_producto()" ><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'
                    }
                ]
            };

            // Upload Archivo Plano

            $scope.opciones_archivo = new Flow();
            $scope.opciones_archivo.target = API.PEDIDOS.CLIENTES.SUBIR_ARCHIVO_PLANO;
            $scope.opciones_archivo.testChunks = false;
            $scope.opciones_archivo.singleFile = true;
            $scope.opciones_archivo.query = {
                session: JSON.stringify($scope.session)
            };

            $scope.cargar_archivo_plano = function($flow) {

                $scope.opciones_archivo = $flow;
            };

            $scope.subir_archivo_plano = function() {


                $scope.opciones_archivo.opts.query.data = JSON.stringify({
                    pedidos_clientes: {
                        cotizacion: $scope.Pedido
                    }
                });

                $scope.opciones_archivo.upload();
            };

            $scope.respuesta_archivo_plano = function(file, message) {

                var data = (message !== undefined) ? JSON.parse(message) : {};

                if (data.status === 200) {

                    var numero_cotizacion = data.obj.pedidos_clientes.numero_cotizacion;

                    if (numero_cotizacion > 0) {
                        $scope.Pedido.set_numero_cotizacion(numero_cotizacion);
                        localStorageService.add("numero_cotizacion", $scope.Pedido.get_numero_cotizacion());
                    }

                    AlertService.mostrarMensaje("warning", data.msj);
                    that.gestionar_consultas_cotizaciones();

                    $scope.datos_view.activar_tab.tab_productos = true;
                    $scope.datos_view.productos_validos = data.obj.pedidos_clientes.productos_validos;
                    $scope.datos_view.productos_invalidos = data.obj.pedidos_clientes.productos_invalidos;

                    $scope.opciones_archivo.cancel();

                    if ($scope.datos_view.productos_invalidos.length > 0) {

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
                                                        <a ng-repeat="producto in datos_view.productos_invalidos" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                            {{ producto.codigo_producto}}\
                                                        </a>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                        </div>',
                            scope: $scope,
                            controller: function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }
                        };
                        var modalInstance = $modal.open($scope.opts);
                    }

                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };

            // Aciones Botones       

            // Cancelar la cotizacion
            $scope.cancelar_cotizacion = function() {
                $state.go('ListarPedidosClientes');
            };

            //Aceptar la cotizacion
            $scope.aceptar_cotizacion = function() {
                $state.go('ListarPedidosClientes');
            };

            // Gestiona la aprobacion o no del departamento de cartera
            $scope.gestion_cartera = function(aprobado) {

                var obj = {};
                var url = '';

                $scope.Pedido.set_aprobado_cartera(aprobado);

                // Observacion cartera para cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {
                    
                    url = API.PEDIDOS.CLIENTES.OBSERVACION_CARTERA_COTIZACION;
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                cotizacion: $scope.Pedido
                            }
                        }
                    };
                }

                // Observacion cartera para pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {
                    
                    url = API.PEDIDOS.CLIENTES.OBSERVACION_CARTERA_PEDIDO;
                    
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                pedido: $scope.Pedido
                            }
                        }
                    };
                }

                Request.realizarRequest(url, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.cancelar_cotizacion();
                    }
                });
            };

            // Gestionar la creacion del pedido
            $scope.gestionar_pedido = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Desea Generar el Pedido ?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea Generar el Pedido para el Cliente.</h4>\
                                    <h4> {{ Pedido.getCliente().get_descripcion() }}?.</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.generar_pedido_cliente();
                            $modalInstance.close();
                        };

                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.generar_pedido_cliente = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.GENERAR_PEDIDO, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        $scope.cancelar_cotizacion();
                    }
                });
            };


            that.init = function() {

                if ($scope.Pedido.get_numero_cotizacion() > 0)
                    that.gestionar_consultas_cotizaciones();

                if ($scope.Pedido.get_numero_pedido() > 0)
                    that.gestionar_consultas_pedidos();
            };


            that.init();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                // Set Datas
                $scope.Empresa.set_default();

                // set localstorage
                localStorageService.add("cotizacion", null);
                localStorageService.add("pedido", null);

                $scope.$$watchers = null;
            });
        }]);
});