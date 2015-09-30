
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/EmpresaPedidoCliente",
    "models/generacionpedidos/pedidosclientes/PedidoCliente",
    "models/generacionpedidos/pedidosclientes/ClientePedido",
    "models/generacionpedidos/pedidosclientes/VendedorPedidoCliente",
    "models/generacionpedidos/pedidosclientes/ProductoPedidoCliente",
    "models/generacionpedidos/pedidosclientes/Laboratorio",
], function(angular, controllers) {

    controllers.controller('ListarPedidosClientesController', [
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
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Pedido, Cliente, Vendedor, Sesion) {

            var that = this;

            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Definicion Variables            
            $scope.Empresa = Empresa;

            var fecha_actual = new Date();

            $scope.datos_view = {
                // Paginacion Cotizaciones
                termino_busqueda_cotizaciones: '',
                ultima_busqueda_cotizaciones: '',
                fecha_inicial_cotizaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final_cotizaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                pagina_actual_cotizaciones: 1,
                cantidad_items_cotizaciones: 0,
                paginando_cotizaciones: false,
                //Paginacion Pedidos
                termino_busqueda_pedidos: '',
                ultima_busqueda_pedidos: '',
                fecha_inicial_pedidos: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final_pedidos: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                pagina_actual_pedidos: 1,
                cantidad_items_pedidos: 0,
                paginando_pedidos: false,
                // Estados Botones n-grid
                estados_cotizaciones: [
                    "btn btn-danger btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-danger btn-xs",
                    "btn btn-success btn-xs"
                ],
                estados_pedidos: [
                    "btn btn-danger btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-info btn-xs",
                    "btn btn-success btn-xs",
                    "btn btn-danger btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-info btn-xs"
                ],
                // Opciones del Modulo 
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones
            };


            // Validar Seleccion Empresa Centro Bodega
            that.validacion_inicial = function() {

                var empresa = Sesion.getUsuarioActual().getEmpresa();

                if (!empresa) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Para Ingresar a Pedidos Clientes : Se debe seleccionar una Empresa", tipo: "warning"});
                    return;
                } else if (!empresa.getCentroUtilidadSeleccionado()) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Para Ingresar a Pedidos Clientes : Se debe seleccionar un Centro de Utilidad", tipo: "warning"});
                    return;
                } else if (!empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "Para Ingresar a Pedidos Clientes : Se debe seleccionar una Bodega", tipo: "warning"});
                    return;
                }
            };

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
                    btn_visualizar_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_visualizar_cotizacion
                    },
                    btn_cartera_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_observacion_cartera_cotizaciones
                    },
                    btn_reporte_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_reporte_cotizaciones
                    },
                    btn_email_cotizaciones: {
                        'click': $scope.datos_view.opciones.sw_enviar_email_cotizaciones
                    },
                    btn_modificar_estado :{
                        'click': $scope.datos_view.opciones.sw_modificar_estado_cotizacion
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
                    btn_visualizar_pedidos: {
                        'click': $scope.datos_view.opciones.sw_visualizar_pedido
                    },
                    btn_cartera_pedidos: {
                        'click': $scope.datos_view.opciones.sw_observacion_cartera_pedidos
                    },
                    btn_reporte_pedidos: {
                        'click': $scope.datos_view.opciones.sw_reporte_pedidos
                    },
                    btn_email_pedidos: {
                        'click': $scope.datos_view.opciones.sw_enviar_email_pedidos
                    }
                };

            };


            // Acciones Botones 
            $scope.gestionar_cotizacion_cliente = function() {

                localStorageService.add("cotizacion", {numero_cotizacion: 0, cartera: '0'});
                $state.go('Cotizaciones');
            };

            $scope.modificar_cotizacion_cliente = function(cotizacion) {

                localStorageService.add("cotizacion", {numero_cotizacion: cotizacion.get_numero_cotizacion(), cartera: '0'});
                $state.go('Cotizaciones');
            };

            $scope.modificar_pedido_cliente = function(pedido) {

                localStorageService.add("pedido", {numero_pedido: pedido.get_numero_pedido()});
                $state.go('PedidoCliente');
            };


            $scope.habilitar_observacion_cartera = function(obj) {

                if (obj.get_numero_cotizacion() > 0) {
                    // Permisos observacion cartera [ cotizaciones ]
                    if (!$scope.datos_view.opciones.sw_observacion_cartera_cotizaciones)
                        return $scope.datos_view.permisos_cotizaciones.btn_cartera_cotizaciones;
                    else
                        return {'click': obj.get_estado_cotizacion() != '0'};
                }
                if (obj.get_numero_pedido() > 0) {
                    // Permisos observacion cartera [ Pedidos ]
                    if (!$scope.datos_view.opciones.sw_observacion_cartera_pedidos)
                        return $scope.datos_view.permisos_pedidos.btn_cartera_pedidos;
                    else
                        return {'click': obj.getEstadoActualPedido() === '0'};
                }
            };

            $scope.generar_observacion_cartera = function(obj) {

                // Observacion cartera para la cotizacion
                if (obj.get_numero_cotizacion() > 0) {
                    localStorageService.add("cotizacion", {numero_cotizacion: obj.get_numero_cotizacion(), cartera: '1'});
                    $state.go('Cotizaciones');
                }

                // Observacion cartera para el pedido
                if (obj.get_numero_pedido() > 0) {
                    localStorageService.add("pedido", {numero_pedido: obj.get_numero_pedido(), cartera: '1'});
                    $state.go('PedidoCliente');
                }
            };

            $scope.visualizar = function(obj) {
                // Visualizar cotizacion
                if (obj.get_numero_cotizacion() > 0) {
                    localStorageService.add("cotizacion", {numero_cotizacion: obj.get_numero_cotizacion(), visualizar: '1'});
                    $state.go('Cotizaciones');
                }

                // Visualizar pedido
                if (obj.get_numero_pedido() > 0) {
                    localStorageService.add("pedido", {numero_pedido: obj.get_numero_pedido(), visualizar: '1'});
                    $state.go('PedidoCliente');
                }
            };

            // Cotizaciones 
            $scope.buscador_cotizaciones = function(ev) {
                if (ev.which === 13) {
                    that.buscar_cotizaciones();
                }
            };

            that.buscar_cotizaciones = function() {

                if ($scope.datos_view.ultima_busqueda_cotizaciones !== $scope.datos_view.termino_busqueda_cotizaciones) {
                    $scope.datos_view.pagina_actual_cotizaciones = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            fecha_inicial: $filter('date')($scope.datos_view.fecha_inicial_cotizaciones, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.datos_view.fecha_final_cotizaciones, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: $scope.datos_view.termino_busqueda_cotizaciones,
                            pagina_actual: $scope.datos_view.pagina_actual_cotizaciones
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_COTIZACIONES, "POST", obj, function(data) {

                    if (data.status === 500) {
                        AlertService.mostrarMensaje("warning", data.msj);
                        return;
                    }

                    if (data.status === 200) {

                        $scope.datos_view.ultima_busqueda_cotizaciones = $scope.datos_view.termino_busqueda_cotizaciones;

                        $scope.datos_view.cantidad_items_cotizaciones = data.obj.pedidos_clientes.lista_cotizaciones.length;

                        if ($scope.datos_view.paginando_cotizaciones && $scope.datos_view.cantidad_items_cotizaciones === 0) {
                            if ($scope.datos_view.pagina_actual_cotizaciones > 0) {
                                $scope.datos_view.pagina_actual_cotizaciones--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_cotizaciones(data.obj.pedidos_clientes.lista_cotizaciones);
                    }
                });
            };

            that.render_cotizaciones = function(cotizaciones) {

                $scope.Empresa.limpiar_cotizaciones();

                cotizaciones.forEach(function(data) {

                    var cotizacion = Pedido.get(data.empresa_id, data.centro_utilidad_id, data.bodega_id);

                    var cliente = Cliente.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
                    cliente.setDepartamento(data.departamento);
                    cliente.setMunicipio(data.municipio);

                    var vendedor = Vendedor.get(data.nombre_vendendor, data.tipo_id_vendedor, data.vendedor_id, data.telefono_vendedor);

                    cotizacion.set_numero_cotizacion(data.numero_cotizacion).set_vendedor(vendedor).setCliente(cliente);
                    cotizacion.set_estado_cotizacion(data.estado).set_descripcion_estado_cotizacion(data.descripcion_estado);
                    cotizacion.set_tipo_producto(data.tipo_producto);
                    cotizacion.setFechaRegistro(data.fecha_registro);

                    $scope.Empresa.set_cotizaciones(cotizacion);
                });
            };

            $scope.lista_cotizaciones_clientes = {
                data: 'Empresa.get_cotizaciones()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_descripcion_estado_cotizacion()', displayName: "Estado Actual", cellClass: "txt-center", width: "10%",
                        cellTemplate: "<button type='button' ng-class='agregar_clase_cotizacion(row.entity.get_estado_cotizacion())'> <span ng-class=''></span> {{ row.entity.get_descripcion_estado_cotizacion() }} </button>"},
                    {field: 'get_numero_cotizacion()', displayName: 'No. Cotización', width: "10%"},
                    {field: 'getCliente().get_descripcion()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_vendedor().get_descripcion()', displayName: 'Vendedor', width: "25%"},
                    {field: 'getFechaRegistro()', displayName: "F. Registro", width: "9%", cellFilter: 'date : "dd-MM-yyyy" '},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                            <li ng-if="row.entity.get_estado_cotizacion() == \'0\' || row.entity.get_estado_cotizacion() == \'2\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_modificar_estado }}" ng-click="activarCotizacion(row.entity)" >Activar</a></li>\
                                                <li ng-if="row.entity.get_estado_cotizacion() == \'0\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_visualizar_cotizaciones }}" ng-click="visualizar(row.entity)" >Visualizar</a></li>\
                                                <li ng-if="row.entity.get_estado_cotizacion() != \'0\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_modificar_cotizaciones }}" ng-click="modificar_cotizacion_cliente(row.entity)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ habilitar_observacion_cartera(row.entity) }}" ng-click="generar_observacion_cartera(row.entity)" >Cartera</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_reporte_cotizaciones }}" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_email_cotizaciones }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };
            
            $scope.activarCotizacion = function(cotizacion){
                that.cambiarEstadoCotizacion(cotizacion.get_numero_cotizacion(), '1');
            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregar_clase_cotizacion = function(estado) {
                return $scope.datos_view.estados_cotizaciones[estado];
            };

            $scope.pagina_anterior_cotizaciones = function() {
                $scope.datos_view.paginando_cotizaciones = true;
                $scope.datos_view.pagina_actual_cotizaciones--;
                that.buscar_cotizaciones();
            };

            $scope.pagina_siguiente_cotizaciones = function() {
                $scope.datos_view.paginando_cotizaciones = true;
                $scope.datos_view.pagina_actual_cotizaciones++;
                that.buscar_cotizaciones();
            };

            // Pedidos
            $scope.buscador_pedidos = function(ev) {
                if (ev.which === 13) {
                    that.buscar_pedidos();
                }
            };
            
            that.cambiarEstadoCotizacion = function(numero, estado){
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: {numero_cotizacion:numero, estado:estado}
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.ACTUALIZAR_ESTADO_COTIZACION, "POST", obj, function(data) {


                    if (data.status === 200) {
                        that.buscar_cotizaciones();
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error");
                    }
                });
            };

            that.buscar_pedidos = function() {

                if ($scope.datos_view.ultima_busqueda_pedidos !== $scope.datos_view.termino_busqueda_pedidos) {
                    $scope.datos_view.pagina_actual_pedidos = 1;
                }

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                            fecha_inicial: $filter('date')($scope.datos_view.fecha_inicial_pedidos, "yyyy-MM-dd") + " 00:00:00",
                            fecha_final: $filter('date')($scope.datos_view.fecha_final_pedidos, "yyyy-MM-dd") + " 23:59:00",
                            termino_busqueda: $scope.datos_view.termino_busqueda_pedidos,
                            pagina_actual: $scope.datos_view.pagina_actual_pedidos
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_PEDIDOS, "POST", obj, function(data) {

                    $scope.datos_view.ultima_busqueda_pedidos = $scope.datos_view.termino_busqueda_pedidos;

                    if (data.status === 200) {

                        $scope.datos_view.cantidad_items_pedidos = data.obj.pedidos_clientes.length;

                        if ($scope.datos_view.paginando_pedidos && $scope.datos_view.cantidad_items_pedidos === 0) {
                            if ($scope.datos_view.pagina_actual_pedidos > 0) {
                                $scope.datos_view.pagina_actual_pedidos--;
                            }
                            AlertService.mostrarMensaje("warning", "No se encontraron mas registros");
                            return;
                        }

                        that.render_pedidos(data.obj.pedidos_clientes);
                    }
                });
            };

            that.render_pedidos = function(pedidos) {

                $scope.Empresa.limpiar_pedidos();

                pedidos.forEach(function(data) {

                    var pedido = Pedido.get(data.empresa_id, data.centro_utilidad_id, data.bodega_id);

                    var cliente = Cliente.get(data.nombre_cliente, data.direccion_cliente, data.tipo_id_cliente, data.identificacion_cliente, data.telefono_cliente);

                    var vendedor = Vendedor.get(data.nombre_vendedor, data.tipo_id_vendedor, data.idetificacion_vendedor, '');

                    pedido.setDatos(data);
                    pedido.setNumeroPedido(data.numero_pedido).set_vendedor(vendedor).setCliente(cliente);
                    pedido.set_descripcion_estado_actual_pedido(data.descripcion_estado_actual_pedido);
                    pedido.setFechaRegistro(data.fecha_registro);

                    $scope.Empresa.set_pedidos(pedido);
                });
            };

            $scope.lista_pedidos_clientes = {
                data: 'Empresa.get_pedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_descripcion_estado_actual_pedido()', displayName: "Estado Actual", cellClass: "txt-center", width: "10%",
                        cellTemplate: "<button type='button' ng-class='agregar_clase_pedido(row.entity.estado_actual_pedido)'> <span ng-class='agregar_restricion_pedido(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
                    {field: 'get_numero_pedido()', displayName: 'No. Pedido', width: "10%"},
                    {field: 'getCliente().get_descripcion()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_vendedor().get_descripcion()', displayName: 'Vendedor', width: "25%"},
                    {field: 'getFechaRegistro()', displayName: "F. Registro", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li ng-if="row.entity.getEstadoActualPedido() != \'0\' "  ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_visualizar_pedidos }}" ng-click="visualizar(row.entity)" >Visualizar</a></li>\
                                                <li ng-if="row.entity.getEstadoActualPedido() == \'0\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_modificar_pedidos }}" ng-click="modificar_pedido_cliente(row.entity)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ habilitar_observacion_cartera(row.entity) }}" ng-click="generar_observacion_cartera(row.entity)" >Cartera</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_reporte_pedidos }}" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_email_pedidos }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregar_clase_pedido = function(estado) {

                if (estado === 6) {
                    return $scope.datos_view.estados_pedidos[1];
                }

                return $scope.datos_view.estados_pedidos[estado];
            };

            // Agregar Restriccion de acuerdo al estado de asigancion del pedido
            $scope.agregar_restricion_pedido = function(estado_separacion) {

                var clase = "";
                if (estado_separacion)
                    clase = "glyphicon glyphicon-lock";

                return clase;
            };

            $scope.pagina_anterior_pedidos = function() {
                $scope.datos_view.paginando_pedidos = true;
                $scope.datos_view.pagina_actual_pedidos--;
                that.buscar_pedidos();
            };

            $scope.pagina_siguiente_pedidos = function() {
                $scope.datos_view.paginando_pedidos = true;
                $scope.datos_view.pagina_actual_pedidos++;
                that.buscar_pedidos();
            };


            that.init = function() {

                that.validacion_inicial();

                that.cargar_permisos();

                that.buscar_cotizaciones();

                that.buscar_pedidos();
            };


            that.init();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});