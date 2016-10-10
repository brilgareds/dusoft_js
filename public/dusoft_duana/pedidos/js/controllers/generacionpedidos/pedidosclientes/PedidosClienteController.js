define(["angular", "js/controllers", 'includes/slide/slideContent'
], function(angular, controllers) {
    //probando branch de pedidos clientes
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
        "webNotification",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Pedido, Cliente, Vendedor, Producto, Sesion, webNotification) {

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
                cartera: false,
                visualizar: false,
                // Opciones del Modulo
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones,
                progresoArchivo: 0,
                btnSolicitarAutorizacionCartera: true,
            };
            $scope.notificacionPedidoAutorizar = 0;
            that.consultarEstadoPedidoCotizacion = function(tipo, numero) {

                var url = '';
                var obj = {};

                if (tipo === 1) {

                    url = API.PEDIDOS.CLIENTES.CONSULTAR_ESTADO_PEDIDO;
                    obj = {
                        session: $scope.session,
                        data: {pedidos_clientes: {pedido: numero}}
                    };

                }

                if (tipo === 2) {

                    url = API.PEDIDOS.CLIENTES.CONSULTAR_ESTADO_COTIZACION;
                    obj = {
                        session: $scope.session,
                        data: {pedidos_clientes: {cotizacion: numero}}
                    };

                }
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        $scope.Pedido.setEstado(data.obj.pedidos_clientes);

                    }
                });
            };
            $scope.items = null;
            $scope.pedidoCotizacion = 8;
            // Inicializacion Pedido o cotizacion
            $scope.Pedido = Pedido.get(
                    Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                    );

            $scope.Pedido.set_vendedor(Vendedor.get()).setCliente(Cliente.get());
            $scope.Pedido.setFechaRegistro($filter('date')(new Date(), "dd/MM/yyyy"));

            //Cotizacion
            //if (localStorageService.get("cotizacion")) {
            if ($state.is("Cotizaciones") === true) {
                var cotizacion = localStorageService.get("cotizacion");
                var numeroCotizacion = 0;
                if (cotizacion) {
                    numeroCotizacion = cotizacion.numero_cotizacion || 0;
                }

                $scope.Pedido.set_numero_cotizacion(parseInt(numeroCotizacion));
                $scope.datos_view.cartera = (cotizacion.cartera === '1') ? true : false;
                $scope.datos_view.visualizar = (cotizacion.visualizar === '1') ? true : false;

                /*
                 * +Descripcion: Se consulta el estado de la cotizacion
                 */
                that.consultarEstadoPedidoCotizacion(2, cotizacion.numero_cotizacion);


                //} else if (localStorageService.get("pedido")) {
            } else if ($state.is("PedidoCliente") === true) {
                //Pedido
                var pedido = localStorageService.get("pedido");
                var numeroPedido = 0;
                if (pedido) {
                    numeroPedido = pedido.numero_pedido || 0;
                }

                $scope.Pedido.setNumeroPedido(parseInt(numeroPedido));

                $scope.datos_view.cartera = (pedido.cartera === '1') ? true : false;
                $scope.datos_view.visualizar = (pedido.visualizar === '1') ? true : false;

                /*
                 * +Descripcion: Se consulta el estado del pedido
                 */
                that.consultarEstadoPedidoCotizacion(1, pedido.numero_pedido);
            }


            // cargar permisos del modulo
            that.cargar_permisos = function() {

                // Permisos para Cotizaciones
                $scope.datos_view.permisos_cotizaciones = {
                    btn_crear_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_crear_cotizacion
                    },
                    btn_modificar_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_modificar_cotizacion
                    },
                    btn_reporte_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_reporte_cotizaciones
                    }
                };
                // Permisos para Pedidos
                $scope.datos_view.permisos_pedidos = {
                    btn_crear_pedidos: {
                        'click': $scope.datos_view.opciones.sw_crear_pedido
                    },
                    btn_modificar_pedidos: {
                        'click': $scope.datos_view.opciones.sw_modificar_pedido
                    },
                    btn_reporte_pedidos: {
                        'click': $scope.datos_view.opciones.sw_reporte_pedidos
                    }
                };
            };
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
            /*
             * @author  Cristian Ardila
             * +Descripcion: Funcion encargada de consultar el detalle del pedido
             *               o de la cotizacion
             * @fecha  19/11/2015
             * @param {evento del teclado} ev
             */
            $scope.buscador_detalle_cotizacion = function(ev) {

                if (ev.which === 13) {
                    if ($scope.Pedido.get_numero_cotizacion() > 0 ||
                            $scope.Pedido.get_numero_pedido() === 0 ||
                            $scope.Pedido.get_numero_pedido() === undefined) {

                        that.buscar_detalle_cotizacion();
                    }

                    if ($scope.Pedido.get_numero_pedido() > 0 ||
                            $scope.Pedido.get_numero_pedido() !== undefined ||
                            $scope.Pedido.get_numero_cotizacion() <= 0) {

                        that.buscar_detalle_pedido();
                    }
                }

            };

            /*
             * @Author: Eduar
             * +Descripcion: Evento que actualiza la barra de progreso
             */
            socket.on("onNotificarProgresoArchivoPlanoClientes", function(datos) {
                $scope.datos_view.progresoArchivo = datos.porcentaje;
            });


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
                    producto.set_cantidad_inicial(data.cantidad_solicitada);
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);
                    producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.subtotal).set_valor_iva(data.valor_iva).set_valor_total_con_iva(data.total);
                    $scope.Pedido.set_productos(producto);
                });


                $scope.items = $scope.Pedido.get_productos().length;
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

                var vendedor = Vendedor.get(data.nombre_vendedor, data.tipo_id_vendedor, data.idetificacion_vendedor/*, data.telefono_vendedor*/);
                $scope.Pedido.set_vendedor(vendedor).setCliente(cliente);
                $scope.Pedido.set_observacion(data.observacion);
                $scope.Pedido.set_tipo_producto(data.tipo_producto).set_descripcion_tipo_producto(data.descripcion_tipo_producto);
                $scope.Pedido.set_aprobado_cartera(data.sw_aprobado_cartera).set_observacion_cartera(data.observacion_cartera);
                $scope.Pedido.setFechaRegistro(data.fecha_registro);
                $scope.Pedido.setEstadoSolicitud(data.estado_actual_pedido);
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
                    console.log("data productos  ", data);
                    var producto = Producto.get(data.codigo_producto, data.descripcion_producto, 0, data.porcentaje_iva);
                    producto.set_cantidad_solicitada(data.cantidad_solicitada);
                    producto.set_cantidad_inicial(data.cantidad_solicitada);
                    producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.valor_unitario * data.cantidad_solicitada);
                    producto.set_valor_iva(data.valor_iva).set_valor_total_con_iva(data.valor_unitario_con_iva * data.cantidad_solicitada);
                    producto.setCantidadPendiente(data.cantidad_pendiente);
                    producto.setCantidadPendienteDespachar(data.cantidad_pendiente);
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
                    cliente.setTipoBloqueoId(data.tipo_bloqueo_id);
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

            $scope.prioridad = [
                {nombre: "Activo", id: 1},
                {nombre: "Aprobar urgente", id: 6}
            ];

            $scope.seleccionarAprobacion = function(model) {
                $scope.Pedido.setEstado(model.id.id)

            };

            $scope.validacion_buscar_productos = function() {


                var disabled = false;
                // Validaciones Generales
                if ($scope.Pedido.getCliente().get_descripcion() === undefined || $scope.Pedido.getCliente().get_descripcion() === '')
                    disabled = true;
                if ($scope.Pedido.get_vendedor().get_descripcion() === undefined || $scope.Pedido.get_vendedor().get_descripcion() === '')
                    disabled = true;
                if ($scope.Pedido.get_observacion() === undefined || $scope.Pedido.get_observacion() === '')
                    disabled = true;


                // Cartera
                if ($scope.datos_view.cartera)
                    disabled = true;
                // Validaciones para la cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {
                    if ($scope.Pedido.get_aprobado_cartera() === '1')
                        disabled = true;
                }

                // Solo visualizar
                if ($scope.datos_view.visualizar)
                    disabled = true;
                return disabled;
            };
            $scope.buscar_productos = function() {

                $scope.slideurl = "views/generacionpedidos/pedidosclientes/gestionarproductosclientes.html?time=" + new Date().getTime();
                $scope.$emit('gestionar_productos_clientes');
            };
            $scope.cerrar_busqueda_productos = function() {

                $scope.$emit('cerrar_gestion_productos_clientes', {animado: true});
                that.gestionar_consultas_cotizaciones();
                that.init();
            };
            $scope.habilitar_modificacion_producto = function() {

                // Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {

                    if (!$scope.datos_view.opciones.sw_modificar_pedido)
                        return $scope.datos_view.permisos_pedidos.btn_modificar_pedidos;
                }

                // Cotizacion
                if (!$scope.datos_view.opciones.sw_modificar_cotizacion)
                    return $scope.datos_view.permisos_cotizaciones.btn_modificar_cotizaciones;
            };
            $scope.habilitar_eliminacion_producto = function() {


                var disabled = false;

                // Validaciones Cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    if ($scope.datos_view.cartera || $scope.Pedido.get_aprobado_cartera() === '1')
                        disabled = true;
                }

                // Validaciones Pedido
                if ($scope.datos_view.cartera) {
                    disabled = true;

                }

                // Solo visualizar
                if ($scope.datos_view.visualizar)
                    disabled = true;

                return disabled;
            };


            $scope.validarCantidadInicialCantidadNueva = function(cantidadInicial, cantidadFinal) {

                var disabled = false;

                if ($scope.Pedido.get_numero_pedido() > 0) {

                    if (cantidadFinal > cantidadInicial) {
                        disabled = true;
                    }

                }
                $scope.datos_view.btnSolicitarAutorizacionCartera = disabled;


            };


            $scope.disabledCheckModificarProducto = function(cantidadInicial, cantidadFinal) {

                var disabled = false;

                if ($scope.Pedido.get_numero_pedido() > 0) {
                    if (cantidadFinal > cantidadInicial) {
                        disabled = true;
                    }

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
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.eliminar_producto();
                            $modalInstance.close();
                        };
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
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
            
            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de modificar el producto de un pedido
             * 
             */
            $scope.confirmar_modificar_producto = function(producto) {
                var productos = [];               
                productos.push(producto);
                $scope.ocultarOpciones = 1;
                
                //OJO VOLVER A DEJAR
                /*that.validarDisponibleProductosCotizacion(productos,function(estado){
                    if(estado){*/

                        $scope.datos_view.producto_seleccionado = producto;
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            template: ' <div class="modal-header">\
                                            <button type="button" class="close" ng-click="close()">&times;</button>\
                                            <h4 class="modal-title">Desea modificar el producto?</h4>\
                                        </div>\
                                        <div class="modal-body">\
                                            <h4>Codigo.</h4>\
                                            <h5> {{ datos_view.producto_seleccionado.getCodigoProducto() }}</h5>\
                                            <h4>Descripcion.</h4>\
                                            <h5> {{ datos_view.producto_seleccionado.getDescripcion() }} </h5>\
                                            <h4>Cantidad.</h4>\
                                            <h5> {{ datos_view.producto_seleccionado.get_cantidad_solicitada() }} </h5>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-warning" ng-click="close()">No</button>\
                                            <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                        </div>',
                            scope: $scope,
                            controller: ["$scope","$modalInstance", function($scope, $modalInstance) {
                         
                                $scope.confirmar = function() {
                                    $scope.modificar_producto(); 
                                    
                                    
                                    $modalInstance.close();
                                };
                                $scope.close = function() {
                                    $modalInstance.close();
                                };
                            }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    //}
                //});
            };

            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de modificar cada producto
             *              en el detalle del pedido
             * @fecha 18/05/2016
             * @returns {unresolved}
             */
            $scope.modificar_producto = function() {

                var producto = $scope.datos_view.producto_seleccionado;

               /* if (producto.getCantidadPendienteDespachar() > producto.getCantidadPendiente() || producto.getCantidadPendienteDespachar() < 0) {

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "La cantidad ingresada no debe ser mayor a la cantidad pendiente");
                    return;
                }*/


                var obj = {};
                var url = '';

                // Cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    url = API.PEDIDOS.CLIENTES.MODIFICAR_DETALLE_COTIZACION;
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

                    url = API.PEDIDOS.CLIENTES.MODIFICAR_DETALLE_PEDIDO;
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

                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    $scope.datos_view.producto_seleccionado = Producto.get();
                    if (data.status === 200) {
                        if ($scope.Pedido.get_numero_cotizacion() > 0)
                            that.buscar_detalle_cotizacion();
                        if ($scope.Pedido.get_numero_pedido() > 0)
                            that.gestionar_consultas_pedidos();
                    }


                });
            };

            $scope.filtroGrid = {filterText: '', useExternalFilter: false};
            // Lista Productos Seleccionados
            $scope.lista_productos = {
                data: 'Pedido.get_productos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                showFooter: true,
                showFilter: true,
                filterOptions: $scope.filtroGrid,
                footerTemplate: '<div class="row col-md-12">\
                                    <div class="col-md-3 pull-right">\
                                        <table class="table table-clear">\
                                            <tbody>\
                                                <tr>\
                                                    <td class="left"><strong>Cnt. Productos</strong></td>\
                                                    <td class="right">{{ Pedido.get_productos().length  }}</td> \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                    <td class="right">{{ Pedido.get_subtotal() | currency : "$" }}</td> \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                    <td class="right">{{ Pedido.get_valor_iva() | currency : "$" }}</td>  \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total</strong></td>\
                                                    <td class="right">{{ Pedido.get_total() | currency : "$" }}</td> \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'getCodigoProducto()', displayName: 'Codigo', width: "10%"},
                    {field: 'getDescripcion()', displayName: 'Descripcion', width: "30%"},
                    {field: 'get_cantidad_solicitada()', width: "8%", displayName: "Cantidad", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> \n\
                                       <input type="text" ng-disabled="habilitar_eliminacion_producto() || Pedido.getEstado() ==5 || Pedido.getEstadoSolicitud() == 8" \n\
                                        ng-model="row.entity.cantidad_solicitada" \n\
                                        validacion-numero-entero \n\
                                        ng-keyup="validarCantidadInicialCantidadNueva(row.entity.cantidad_inicial,row.entity.cantidad_solicitada)"\
                                        class="form-control grid-inline-input" \n\
                                  name="" id="" /> </div>'},
                    {field: 'get_cantidad_solicitada()', width: "8%", displayName: "Cantidad pendiente", cellFilter: "number",
                        cellTemplate: '<div class="col-xs-12"> \n\
                                       <input type="text" ng-disabled="Pedido.getEstadoSolicitud() != 8 " \n\
                                        ng-model="row.entity.cantidadPendienteDespachar" \n\
                                        validacion-numero-entero \n\
                                        ng-keyup="validarCantidadInicialCantidadNueva(row.entity.cantidad_inicial,row.entity.cantidad_solicitada)"\
                                        class="form-control grid-inline-input" \n\
                                        name="" id="" /> </div>'},
                    /* {field: 'getCantidadPendienteDespachar()', width: "8%", displayName: "Cantidad pendiente", cellFilter: "number",
                     cellTemplate: '<div class="col-xs-12"> \n\
                     <input type="text" ng-disabled="Pedido.getEstadoSolicitud() != 8 " \n\
                     ng-model="row.entity.cantidadPendienteDespachar" \n\
                     validacion-numero-entero \n\
                     ng-keyup="validarCantidadInicialCantidadNueva(row.entity.cantidad_inicial,row.entity.cantidadPendiente)"\
                     class="form-control grid-inline-input" \n\
                     name="" id="" /> </div>'},*/
                    {field: 'get_iva()', displayName: 'I.V.A', width: "8%"},
                    {field: 'get_precio_venta()', displayName: 'Vlr. Unit', width: "10%", cellFilter: 'currency : "$"'},
                    {field: 'get_valor_total_sin_iva()', displayName: 'Subtotal', width: "10%", cellFilter: 'currency : "$"'},
                    {field: 'get_valor_total_con_iva()', displayName: 'Total', width: "8%", cellFilter: 'currency : "$"'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-toolbar">\
                                        <button class="btn btn-default btn-xs" ng-validate-events="{{ habilitar_modificacion_producto() }}" ng-click="confirmar_modificar_producto(row.entity)" ng-disabled="habilitar_eliminacion_producto()" || disabledCheckModificarProducto(row.entity.cantidad_inicial,row.entity.cantidad_solicitada)"  ><span class="glyphicon glyphicon-ok"></span></button>\
                                        <button class="btn btn-default btn-xs" ng-validate-events="{{ habilitar_modificacion_producto() }}" ng-click="confirmar_eliminar_producto(row.entity)" ng-disabled="habilitar_eliminacion_producto()" ><span class="glyphicon glyphicon-remove"></span></button>\
                                       </div>'
                    }
                ]
            };

            /**
             * +Descripcion: Metodo encargado de insertar la cantidad en el detalle
             *               de un producto de un pedido
             * @author Cristian Ardila
             * @fecha  28/11/2015
             * @returns {undefined}
             */
            that.insertarCantidadDetalleProducto = function(estado_pedido) {


                var url = API.PEDIDOS.CLIENTES.INSERTAR_CANTIDAD_DETALLE_PRODUCTO_PEDIDO;
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            pedido: $scope.Pedido,
                            producto: $scope.Pedido.get_productos(),
                            estado: estado_pedido
                        }
                    }
                };

                //socket.emit("onEnviarNotificacionPedidosClientes", obj);
                Request.realizarRequest(API.PEDIDOS.CLIENTES.ENVIAR_NOTIFICACION_PEDIDOS_CLIENTES, "POST", obj, function(data) {

                });
                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        AlertService.mostrarMensaje("warning", data.msj);
                    }
                });

            };

            $scope.registrarProductoModificado = function() {


                // Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {

                    var url = API.PEDIDOS.CLIENTES.VALIDAR_ESTADO_TOTAL_PEDIDO;
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                pedido: $scope.Pedido,
                                producto: $scope.Pedido.get_productos()
                            }
                        }
                    };
                }
                ;


                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Registrando cambios", "Desea modificar la cantidad de los productos",
                                function(confirmar) {

                                    if (confirmar) {
                                        that.insertarCantidadDetalleProducto(data.obj.pedidos_clientes[0]);

                                    }
                                });


                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);

                    }

                });
            };




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
                $scope.datos_view.progresoArchivo = 2;

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
                            controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $scope.datos_view.progresoArchivo = 0;
                                    $modalInstance.close();
                                };
                            }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    }

                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }
            };
            // Acciones Botones

            // Cancelar la cotizacion
            $scope.volver_cotizacion = function() {
                var cotizacion = localStorageService.get("cotizacion");

                if (cotizacion) {

                    localStorageService.add("terminoBusqueda", {busqueda: cotizacion.busqueda, filtro_actual_cotizacion: cotizacion.filtro_actual_cotizacion});
                }

                var pedido = localStorageService.get("pedido");

                if (pedido) {
                    localStorageService.add("terminoBusquedaPedido", {busqueda: pedido.busqueda, activar: true, filtro_actual_pedido: pedido.filtro_actual_pedido});

                }

                $state.go('ListarPedidosClientes');
            };
            //Aceptar la cotizacion
            $scope.aceptar_cotizacion = function() {
                that.actualizarCabeceraPedidoCliente();
                $state.go('ListarPedidosClientes');
            };

            /**
             * @author Cristian Ardila
             * @fecha  17/11/2015
             * +Descripcion: FUncion encargada de cancelar la cotizacion
             */
            $scope.cancelar_cotizacion = function() {

                if ($scope.Pedido.get_numero_cotizacion() === 0) {
                    $state.go('ListarPedidosClientes');
                } else {
                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Eliminando cotizacion ?</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h4>Desea cancelar la cotizacion para el cliente.</h4>\
                                    <h4> {{ Pedido.getCliente().get_descripcion() }}?.</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                        scope: $scope,
                        controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                            $scope.confirmar = function() {
                                that.eliminarCotizacionDetalle();
                                $modalInstance.close();
                            };
                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        }]
                    };
                    var modalInstance = $modal.open($scope.opts);
                }
            };

            that.eliminarCotizacionDetalle = function() {

                var url = API.PEDIDOS.CLIENTES.ELIMINAR_COTIZACION;
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: $scope.Pedido
                        }
                    }
                };

                Request.realizarRequest(url, "POST", obj, function(data) {



                    if (data.status === 200) {
                        $state.go('ListarPedidosClientes');
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                    if (data.status === 404) {

                        AlertService.mostrarMensaje("Mensaje del sistema", data.msj);
                    }
                });


            };
            /**
             * +Descripcion: funcion encargada de actualizar la cabecera de
             *               una cotizacion cuando se selecciona la opcion
             *               de modificando
             * @author Cristian Ardila
             * @fecha  09/11/2015
             * @returns {undefined}
             */
            that.actualizarCabeceraPedidoCliente = function() {

                var obj = {};
                var url = '';

                // Observacion cartera para cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    url = API.PEDIDOS.CLIENTES.ACTUALIZAR_CABECERA_COTIZACION;
                    obj = {
                        session: $scope.session,
                        data: {
                            pedidos_clientes: {
                                cotizacion: $scope.Pedido
                            }
                        }
                    };
                }


                Request.realizarRequest(url, "POST", obj, function(data) {


                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", data.msj);
                    }
                });

            };
            
            
            /**
             * @author Cristian Ardila
             * +Descripcion Metodo encargado de validar la disponibilidad de los
             *              productos
             * @fecha 30/09/2016 DD/MM/YYYY
             * 
             **/
            that.validarDisponibleProductosCotizacion = function(producto,callback) {
                
                var obj = {
                        session: $scope.session,                                 
                        data: {
                            pedidos_clientes: {
                                empresa_id: $scope.Pedido.get_empresa_id(),
                                centro_utilidad_id: $scope.Pedido.get_centro_utilidad_id(),
                                bodega_id: $scope.Pedido.get_bodega_id(),
                                contrato_cliente_id: $scope.Pedido.getCliente().get_contrato(), //894
                                pagina_actual: 1,
                                productos: producto.length > 0 ? producto : $scope.Pedido.productos,//'0104030001', 
                                tipo_producto: '',
                                numero_cotizacion: '',
                                numero_pedido: '',
                                filtro: {nombre: 'codigo', tipo_busqueda: 2},
                                //nuevo campos
                                molecula: '',
                                laboratorio_id: '',
                                codigoProducto: '',
                                descripcionProducto: '',
                                concentracion: '',
                                tipoBusqueda: 0,
                                termino_busqueda: ''
                            }
                        }
                    };
                 
                Request.realizarRequest(API.PEDIDOS.CLIENTES.VALIDAR_DISPONIBILIDAD, "POST", obj, function(data) {
                    
                    if (data.status === 200) {
                      
                        $scope.datos_view.productos_no_disponible = data.obj.pedidos_clientes.producto;
                       if(data.obj.pedidos_clientes.producto.length > 0){
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
                                                <h4 >Lista productos sin disponibilidad.</h4>\
                                                <div class="row" style="max-height:300px; overflow:hidden; overflow-y:auto;">\
                                                    <div class="list-group">\
                                                        <a ng-repeat="producto in datos_view.productos_no_disponible" class="list-group-item defaultcursor" href="javascript:void(0)">\
                                                        Cantidad solicitada ({{ producto.cantidad_solicitada}})  Cantidad disponible ({{ producto.cantidad_disponible}}) para el codigo ({{ producto.codigo_producto}}) \
                                                        </a>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="col-md-12" ng-if = "ocultarOpciones == 0">\
                                                <fieldset>\
                                                    <legend>Observación Cartera</legend>\
                                                    <div class="row">\
                                                        <div class="col-md-12">\
                                                            <textarea  ng-model="Pedido.observacion_cartera" \
                                                            ng-disabled="!datos_view.cartera" class="col-lg-12 col-md-12 col-sm-12" \
                                                            rows="4" name="" placeholder="Ingresar Observación Cartera"></textarea>\
                                                        </div>\
                                                    </div>\
                                                </fieldset>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Cerrar</button>\
                                            <button class="btn btn-danger" ng-click="desaprobarCartera(4)" ng-if = "ocultarOpciones == 0" ng-disabled ="Pedido.get_estado_cotizacion() ==5 || Pedido.getEstado() ==4">\
                                                Denegado Cartera\
                                            </button>\
                                        </div>',
                            scope: $scope,
                            controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                                $scope.close = function() {
                                    $scope.datos_view.progresoArchivo = 0;
                                    $modalInstance.close();
                                };
                            }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                        
                       }else{
                           
                           callback(true);
                       }
                       
                    }else{
                        
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error en la consulta");
                        
                    }
                });
             
            };
            
           /**
            * @author Cristian Ardila
            * +Descripcion Metodo que se invoca desde la ventana que valida si
            *              hay disponibles con el proposito de desaprobar la
            *              cotizacion
            * @fecha 30/09/2016
            */
           $scope.desaprobarCartera = function(aprobado){
               that.generarPedidoCartera(aprobado);
             
           };
            
            // Gestiona la aprobacion o no del departamento de cartera
            $scope.gestion_cartera = function(aprobado, denegar) {
                $scope.ocultarOpciones = 0;
                var productos = [];
                if(denegar === 1){    
                    
                    
                    
                   
                    that.generarPedidoCartera(aprobado);
                }else{
                    
                    //OJO VOLVER A DEJAR
                    that.generarPedidoCartera(aprobado);
                    /*that.validarDisponibleProductosCotizacion(productos,function(estado){
                        if(estado){
                            that.generarPedidoCartera(aprobado);
                          
                        }
                    });*/
                }
               
            };

            that.generarPedidoCartera = function(aprobado){
                
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
                                pedido: $scope.Pedido,
                                aprobado: aprobado
                            }
                        }
                    };
                }

                Request.realizarRequest(url, "POST", obj, function(data) {


                    if (data.status === 200) {
                        /*Se valida si es una cotizacion y entonces se procede
                         a crear el pedido*/
                        if ($scope.Pedido.get_numero_cotizacion() > 0) {

                            var parametros = {busqueda: cotizacion.busqueda,
                                pedido_creado: 1, filtro_actual_cotizacion: {nombre: "Numero", tipo_busqueda: 0},
                            };

                            localStorageService.add("terminoBusqueda", parametros);

                            $scope.gestionar_pedido()
                        }
                        if ($scope.Pedido.get_numero_pedido() > 0) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            $scope.volver_cotizacion();
                        }                                 
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        //$scope.volver_cotizacion();
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
                                    <h4 class="modal-title">Desea autorizar la cotizacion ?</h4>\
                                </div>\
                                <div class="modal-body">\
                                     \
                                    <h4> {{ Pedido.getCliente().get_descripcion() }}?.</h4>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Si</button>\
                                </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.confirmar = function() {
                            $scope.generar_pedido_cliente();
                            $modalInstance.close();
                        };
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
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

                    console.log("data ", data)

                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", "Se atendio la solicitud satisfactoriamente");
                        $scope.volver_cotizacion();
                    }

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        //$scope.volver_cotizacion();
                    }
                });
            };
            $scope.habilitar_generacion_reporte = function() {

                // Pedido
                if ($scope.Pedido.get_numero_pedido() > 0) {
                    if (!$scope.datos_view.opciones.sw_reporte_pedidos)
                        return $scope.datos_view.permisos_pedidos.btn_reporte_pedidos;
                }

                // Cotizacion
                if ($scope.Pedido.get_numero_cotizacion() > 0) {

                    if (!$scope.datos_view.opciones.sw_reporte_cotizaciones)
                        return $scope.datos_view.permisos_cotizaciones.btn_reporte_cotizaciones;
                }
            };
            $scope.descargar_enviar_reporte = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                        <button type="button" class="close" ng-click="cancelar_generacion_reporte()">&times;</button>\
                                        <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <div class="btn-group btn-group-justified" role="group" aria-label="...">\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-success" ng-click="descargar_reporte_pdf()" ><span class="glyphicon glyphicon-cloud-download"></span> Descargar PDF</button>\
                                            </div>\
                                            <div class="btn-group" role="group">\
                                              <button type="button" class="btn btn-primary" ng-click="enviar_reporte_pdf_email()" ><span class="glyphicon glyphicon-send"></span> Enviar por Email</button>\
                                            </div>\
                                        </div>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {

                        $scope.descargar_reporte_pdf = function() {

                            $scope.generar_reporte($scope.Pedido, true);
                            $modalInstance.close();
                        };
                        $scope.enviar_reporte_pdf_email = function() {
                            $scope.ventana_enviar_email($scope.Pedido);
                            $modalInstance.close();
                        };
                        $scope.cancelar_generacion_reporte = function() {
                            $modalInstance.close();
                        };
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            };




            that.init = function() {

                that.buscar_vendedores(function() {

                });
                that.cargar_permisos();
                if ($scope.Pedido.get_numero_pedido() > 0) {
                    that.gestionar_consultas_pedidos();
                }
                if ($scope.Pedido.get_numero_cotizacion() > 0) {
                    that.gestionar_consultas_cotizaciones();
                }
            };

            that.init();



            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                // set localstorage
                localStorageService.add("cotizacion", null);
                //Se comento para no borrar el localstorage en modificar producto
                // localStorageService.add("pedido", null);
                localStorageService.get("estadoPedido", null);

            });
        }]);
});
