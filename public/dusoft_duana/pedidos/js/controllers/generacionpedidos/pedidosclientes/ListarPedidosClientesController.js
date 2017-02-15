
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/EmpresaPedidoCliente",
    "models/generacionpedidos/pedidosclientes/PedidoCliente",
    "models/generacionpedidos/pedidosclientes/ClientePedido",
    "models/generacionpedidos/pedidosclientes/VendedorPedidoCliente",
    "models/generacionpedidos/pedidosclientes/ProductoPedidoCliente",
    "models/generacionpedidos/pedidosclientes/Laboratorio",
    "models/generacionpedidos/pedidosclientes/Molecula",
    "includes/components/logspedidos/LogsPedidosController"
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
        "webNotification", "Laboratorio", "Molecula", "ProductoPedidoCliente",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Pedido, Cliente, Vendedor, Sesion, webNotification, Laboratorio, Molecula, Producto) {

            var that = this;

            // Definicion Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };
            // Definicion Variables
            $scope.Empresa = Empresa;
            var fecha_actual = new Date();
            /**
             * +Descripcion: Contador de notificaciones
             */
            $scope.notificacionClientesAutorizar = 0;
            $scope.notificacionPedidoAutorizar = 0;

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
                activarTabPedidos: false,
                termino_busqueda_moleculas: '',
                // Estados Botones n-grid
                estados_cotizaciones: [
                    "btn btn-danger btn-xs",
                    "btn btn-primary btn-xs",
                    "btn btn-danger btn-xs",
                    "btn btn-info btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-success btn-xs",
                    "btn btn-warning btn-xs"
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
                    "btn btn-info btn-xs",
                    "btn btn-warning btn-xs",
                    "btn btn-warning btn-xs"
                ],
                filtros: [
                    {nombre: "Numero", tipo_busqueda: 0},
                    {nombre: "Cliente", tipo_busqueda: 1},
                    {nombre: "Vendedor", tipo_busqueda: 2}
                ],
                opcion_pedido: [
                    {descripcion: "Crear",tipo_pedido: 0},
                    {descripcion: "Crear multiple",tipo_pedido: 1}              
                ],
                opcion_inicial: {descripcion: "Seleccione",tipo_pedido: -1},
                    
                
                filtro: {nombre: "Numero", tipo_busqueda: 0},
                filtro_pedido: {nombre: "Numero", tipo_busqueda: 0},
                filtro_actual_cotizacion: {},
                filtro_actual_pedido: {},
                // Opciones del Modulo
                opciones: Sesion.getUsuarioActual().getModuloActual().opciones,
                inactivarTab: false
            };
            $scope.listarFacuras = false;
            
            
            /**
             * +Descripcion Menu desplegable para seleccionar el tipo de cotizacion
             *              que desee realizar el usario,
             *              0 = Cotizacion
             *              1 = Cotizacion multiple
             */
            $scope.onSeleccionOpcionPedido = function(opcion) {
                $scope.datos_view.opcion_inicial = opcion;
                
               
                if(opcion.tipo_pedido === 0){   
                    localStorageService.add("cotizacion", {numero_cotizacion: 0, cartera: '0', multiple_pedido: 0});
                    $state.go('Cotizaciones');
                }
                
                if(opcion.tipo_pedido === 1){    
                    localStorageService.add("cotizacion", {numero_cotizacion: 0, cartera: '0', multiple_pedido: 1});
                    $state.go('Cotizaciones');
                 
                }
                 
            };
            
            
            /**
             * +Descripcion Menu desplegable para filtar en la busqueda de
             *              una cotizacion
             */
            $scope.onSeleccionFiltroCotizacion = function(filtro) {
                $scope.datos_view.filtro = filtro;

            };
            /**
             * +Descripcion Menu desplegable para filtar en la busqueda de
             *              un pedido
             */
            $scope.onSeleccionFiltroPedido = function(filtro) {
                $scope.datos_view.filtro_pedido = filtro;

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
                    btn_modificar_estado: {
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


            //Acciones Botones
            $scope.gestionar_cotizacion_cliente = function() {
               
                localStorageService.add("cotizacion", {numero_cotizacion: 0, cartera: '0'});
                $state.go('Cotizaciones');
            };    

            $scope.modificar_cotizacion_cliente = function(cotizacion) {
                $scope.datos_view.filtro_actual_cotizacion = $scope.datos_view.filtro;
                localStorageService.add("cotizacion", {numero_cotizacion: cotizacion.get_numero_cotizacion(),
                    cartera: '0',
                    busqueda: $scope.datos_view.termino_busqueda_cotizaciones,
                    filtro_actual_cotizacion: $scope.datos_view.filtro_actual_cotizacion});
                $state.go('Cotizaciones');
            };

            $scope.modificar_pedido_cliente = function(pedido) {
                $scope.datos_view.filtro_actual_pedido = $scope.datos_view.filtro_pedido;

                localStorageService.add("pedido", {numero_pedido: pedido.get_numero_pedido(),
                    busqueda: $scope.datos_view.termino_busqueda_pedidos,
                    filtro_actual_pedido: $scope.datos_view.filtro_actual_pedido});
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
                
                if(obj.getEstado() === '0' && obj.get_estado_cotizacion() === '1'){
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe enviar la solicitud a cartera");
                    return;
                }
              
                // Observacion cartera para la cotizacion
                if (obj.get_numero_cotizacion() > 0) {
                    localStorageService.add("cotizacion", {numero_cotizacion: obj.get_numero_cotizacion(), cartera: '1', tipoPedido: obj.getTipoPedido()});
                    $state.go('Cotizaciones');
                }

                // Observacion cartera para el pedido
                if (obj.get_numero_pedido() > 0) {
                    localStorageService.add("pedido", {numero_pedido: obj.get_numero_pedido(), cartera: '1', tipoPedido: obj.getTipoPedido()});
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
                    that.buscar_cotizaciones('');
                }
            };

            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;

            };

            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = true;

            };

            /**
             * +Descripcion: Funcion encargada de consultar la lista de cotizaciones
             * @param {type} estado
             * @returns {void}
             */
            that.buscar_cotizaciones = function(estado) {
              if(estado===6){
              $scope.datos_view.filtro=$scope.datos_view.filtro===undefined?{nombre: "Numero", tipo_busqueda: 0}:$scope.datos_view.filtro;
              }
                var terminoBusqueda = localStorageService.get("terminoBusqueda");

                if (terminoBusqueda) {
                    
                    localStorageService.add("terminoBusquedaPedido", null);
                    $scope.datos_view.filtro = terminoBusqueda.filtro_actual_cotizacion;
                    $scope.datos_view.termino_busqueda_cotizaciones = terminoBusqueda.busqueda;
                    
                }
                // $scope.datos_view.filtro = {nombre: "Numero", tipo_busqueda: 0};
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
                            termino_busqueda: $scope.datos_view.termino_busqueda_cotizaciones===undefined?'':$scope.datos_view.termino_busqueda_cotizaciones,
                            pagina_actual: $scope.datos_view.pagina_actual_cotizaciones,
                            estado_cotizacion: estado,
                            filtro: $scope.datos_view.filtro
                        }
                    }
                };
                
                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_COTIZACIONES, "POST", obj, function(data) {

                    if (data.status === 500) {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        return;
                    }

                    if (data.status === 200) {

                        $scope.datos_view.ultima_busqueda_cotizaciones = $scope.datos_view.termino_busqueda_cotizaciones;

                        $scope.datos_view.cantidad_items_cotizaciones = data.obj.pedidos_clientes.lista_cotizaciones.length;

                        if ($scope.datos_view.paginando_cotizaciones && $scope.datos_view.cantidad_items_cotizaciones === 0) {
                            if ($scope.datos_view.pagina_actual_cotizaciones > 0) {
                                $scope.datos_view.pagina_actual_cotizaciones--;
                            }
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No se encontraron mas registros");
                            return;
                        }
                           
                        that.render_cotizaciones(data.obj.pedidos_clientes.lista_cotizaciones);
                      
                    }
                });

                localStorageService.add("terminoBusqueda", null);
            };

            /**
             * +Descripcion: Carga la lista de cotizaciones al seleccionar
             *               el tab de notificacion de cotizaciones
             *
             * @param {type} estado
             */
            $scope.cargarListaNotificacionCotizacion = function(estado) {
                $scope.datos_view.termino_busqueda_cotizaciones  = '';
                that.buscar_cotizaciones(estado);
                $scope.notificacionClientesAutorizar = 0;

            };

            /**
             * @author Cristian Ardila
             * @fecha 10/03/2016
             * +Descripcion Metodo encargado de modelar el detallado de una cotizacion
             */
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
                    cotizacion.setNumeroPedido(data.numero_pedido);
                    
                    cotizacion.setTipoPedido(data.tipo_pedido);

                    $scope.Empresa.set_cotizaciones(cotizacion);
                });
                $scope.Empresa.get_cotizaciones();
            };

            $scope.lista_cotizaciones_clientes = {
                data: 'Empresa.get_cotizaciones()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'get_descripcion_estado_cotizacion()', displayName: "Estado Actual", cellClass: "txt-center", width: "10%",
                        cellTemplate: "<button type='button' \n\
                                        ng-class='agregar_clase_cotizacion(row.entity.get_estado_cotizacion())'> \n\
                                        <span ng-class=''></span> {{ row.entity.get_descripcion_estado_cotizacion() }} </button>"},
                    {field: 'get_numero_cotizacion()', displayName: 'No. Cotización', width: "10%"},
                    {field: 'get_numero_pedido()', displayName: 'No. Pedido', width: "10%"},
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
                                                <li ng-if="row.entity.get_estado_cotizacion() != \'0\' " ><a href="javascript:void(0);"  ng-click="solicitarAutorizacion(row.entity)" >Solicitar autorizacion</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ habilitar_observacion_cartera(row.entity) }}" ng-click="generar_observacion_cartera(row.entity)" >Cartera</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_reporte_cotizaciones }}" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_cotizaciones.btn_email_cotizaciones }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            $scope.activarCotizacion = function(cotizacion) {
                that.cambiarEstadoCotizacion(cotizacion.get_numero_cotizacion(), '1');
            };

            $scope.solicitarAutorizacion = function(cotizacion) {
                 
                var estadoCotizacion = cotizacion.get_estado_cotizacion()

                if (estadoCotizacion === '6' || estadoCotizacion === '3' || estadoCotizacion === '5') {

                    AlertService.mostrarMensaje("warning", "Accion no permitida");

                    return;
                } else {
                    that.cambiarEstadoCotizacionAutorizacion(cotizacion);
                }

            };


            // Agregar Clase de acuerdo al estado del pedido
            $scope.agregar_clase_cotizacion = function(estado) {
                return $scope.datos_view.estados_cotizaciones[estado];
            };

            $scope.pagina_anterior_cotizaciones = function() {
                $scope.datos_view.paginando_cotizaciones = true;
                $scope.datos_view.pagina_actual_cotizaciones--;
                that.buscar_cotizaciones('');
            };

            $scope.pagina_siguiente_cotizaciones = function() {
                $scope.datos_view.paginando_cotizaciones = true;
                $scope.datos_view.pagina_actual_cotizaciones++;
                that.buscar_cotizaciones('');
            };

            // Pedidos
            $scope.buscador_pedidos = function(ev) {
                if (ev.which === 13) {
                    
                    that.buscar_pedidos('', '');
                }
            };

            that.cambiarEstadoCotizacion = function(numero, estado) {
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: {numero_cotizacion: numero, estado: estado}
                        }
                    }
                };

                Request.realizarRequest(API.PEDIDOS.CLIENTES.ACTUALIZAR_ESTADO_COTIZACION, "POST", obj, function(data) {


                    if (data.status === 200) {
                        that.buscar_cotizaciones('');
                    } else {
                        AlertService.mostrarMensaje("warning", "Se genero un error");
                    }
                });
            };


            that.buscar_detalle_cotizacion = function(cotizacion, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            cotizacion: cotizacion,
                            termino_busqueda: ''
                        }
                    }
                };
                Request.realizarRequest(API.PEDIDOS.CLIENTES.CONSULTAR_DETALLE_COTIZACION, "POST", obj, function(data) {
                     
                    if (data.status === 200) {
                        callback(true, data)

                        //that.render_productos_cotizacion(data.obj.pedidos_clientes.lista_productos);
                    }
                });
            };

            
            /**
             * @author Cristian Manuel Ardila Troches
             * +Descripcion Metodo encargado de desplegar la ventana modal
             *              con los productos sin disponibilidad o que tengan
             *              la cantidad disponible menor a la solicitada
             * @fecha 17/11/2016
             */
            that.ventanaProductosSinDisponibilidad = function(productos){
                
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/generacionpedidos/pedidosclientes/validardisponibilidadproductoscontroller.html',
                    scope: $scope,                  
                    controller: "ValidarDisponibilidadProductosController",
                    resolve: {
                        pedido: function() {
                            return productos;
                        },
                        swBotonDenegarCartera:function() {
                            return 0;
                        }
                    }           
                };
                var modalInstance = $modal.open($scope.opts);   

                modalInstance.result.then(function(){ 
                },function(){});     
            };
            
            /**
             * @author Cristian Manuel Ardila
             * +Descripcion Metodo invocado al momento de solicitar autorizacion 
             *              a cartera para una cotizacion en la lista de cotizaciones
             * @fecha 17/11/2016
             */
            that.validarDisponibilidadProducto = function(obj, callback){
                    
                Request.realizarRequest(API.PEDIDOS.CLIENTES.VALIDAR_DISPONIBILIDAD, "POST", obj, function(data) {
                       
                    if (data.status === 200) {

                        if(data.obj.pedidos_clientes.producto.length>0){  

                            var observacion="**Productos sin disponibilidad** \n";
                            data.obj.pedidos_clientes.producto.forEach(function(info){

                              observacion +="Cantidad solicitada ("+info.cantidad_solicitada+")  Cantidad disponible ("+ info.cantidad_disponible+") para el codigo ("+ info.codigo_producto+") \n";

                            });
                            observacion+=$scope.Pedido.get_observacion_cartera();
                            $scope.Pedido.set_observacion_cartera(observacion);
                      }

                //$scope.datos_view.productos_no_disponible = data.obj.pedidos_clientes.producto;
                  if(data.obj.pedidos_clientes.producto.length > 0){      
                      
                        that.ventanaProductosSinDisponibilidad(data.obj.pedidos_clientes.producto);
                        
               /*
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
                                          <button class="btn btn-danger" ng-click="desaprobarCartera(4)" ng-if = "ocultarOpciones == 0" >\
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
                var modalInstance = $modal.open($scope.opts);*/
                
                }else{                           
                   callback(true);
                }
              
              }else{                      
                  AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error en la consulta");                       
              } 

            });  
                      
        };
            /**
             * +Descripcion: FUncion encargada de actualizar el estado de una cotizacion
             *               estado =6 (Se solicita autorizacion)
             * @param {type} cotizacion
             * @returns {undefined}
             */
            that.cambiarEstadoCotizacionAutorizacion = function(cotizacion) {
                
                that.buscar_detalle_cotizacion(cotizacion, function(estado, data) {
                    
                    var productos = data.obj.pedidos_clientes.lista_productos;
                        $scope.Pedido.limpiar_productos();
                    productos.forEach(function(data) {
                           
                        var _producto = Producto.get(data.codigo_producto, data.descripcion_producto, 0, data.iva);
                        _producto.set_cantidad_inicial(data.cantidad_solicitada);
                        _producto.set_cantidad_solicitada(data.cantidad_solicitada);
                        _producto.set_precio_venta(data.valor_unitario).set_valor_total_sin_iva(data.subtotal).set_valor_iva(data.valor_iva).set_valor_total_con_iva(data.total);
                        $scope.Pedido.set_productos(_producto);

                    });
                    cotizacion.set_productos($scope.Pedido.get_productos())
                  
                    
                    var objValidarDisponibilidad = {
                        session: $scope.session,                                 
                        data: {
                            pedidos_clientes: {
                                empresa_id: $scope.Pedido.get_empresa_id(),
                                centro_utilidad_id: $scope.Pedido.get_centro_utilidad_id(),                            
                                bodega_id: $scope.Pedido.get_bodega_id(),
                                contrato_cliente_id: cotizacion.getCliente().contrato_id, //894
                                pagina_actual: 1,
                                productos: $scope.Pedido.get_productos(),//'0104030001', 
                                tipo_producto: '',
                                numero_cotizacion: '',
                                numero_pedido: '',
                                filtro: {nombre: 'codigo', tipo_busqueda: 2, numero: [cotizacion.get_numero_cotizacion()], tipo:1},
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
                    
                    that.validarDisponibilidadProducto(objValidarDisponibilidad,function(estado){
                        
                        if(estado){
                            var obj = {
                                session: $scope.session,
                                data: {
                                    pedidos_clientes: {
                                        cotizacion: {numeroCotizacion: cotizacion.get_numero_cotizacion(), estado: '6', cotizacion: cotizacion}
                                    }
                                }
                            };

                        Request.realizarRequest(API.PEDIDOS.CLIENTES.SOLICITAR_AUTORIZACION, "POST", obj, function(data) {

                            if (data.status === 200) {
                                that.buscar_cotizaciones('');

                            } else {
                                AlertService.mostrarMensaje("warning", "Se genero un error");
                            }
                        }); 
                        }
                    });
                   
                });
            };
            
            


            /**
             * +Descripcion: Funcion encargada de consultar los pedidos
             * @param {type} estado
             * @param {type} estadoSolicitud
             * @returns {void}
             */
            that.buscar_pedidos = function(estado, estadoSolicitud) {
                
              
                
                //Se obtiene el criterio de busqueda a traves del local storage
                //con el objetivo de que el usuario al modificar un pedido
                //y regrese al listado de todos los pedidos, conserve el filtro
                var terminoBusqueda = localStorageService.get("terminoBusquedaPedido");

                if (terminoBusqueda) {
                    $scope.datos_view.filtro_pedido = terminoBusqueda.filtro_actual_pedido;
                    $scope.datos_view.activarTabPedidos = terminoBusqueda.activar;

                    //datos_view.inactivarTab
                    $scope.datos_view.termino_busqueda_pedidos = terminoBusqueda.busqueda;
                }

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
                            //filtroEstadoFacturado: $scope.Pedido.getFiltroEstadoFacturado(),
                            termino_busqueda: $scope.datos_view.termino_busqueda_pedidos,
                            pagina_actual: $scope.datos_view.pagina_actual_pedidos,
                            estado_pedido: estado,
                            estado_solicitud: estadoSolicitud,
                            filtros: $scope.datos_view.filtro_pedido
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
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "No se encontraron mas registros");
                            return;
                        }

                        that.render_pedidos(data.obj.pedidos_clientes);
                    }
                });

                localStorageService.add("terminoBusquedaPedido", null);
            };

            that.render_pedidos = function(pedidos) {

                $scope.Empresa.limpiar_pedidos();

                pedidos.forEach(function(data) {

                    var pedido = Pedido.get(data.empresa_id, data.centro_utilidad_id, data.bodega_id);

                    var cliente = Cliente.get(data.nombre_cliente, data.direccion_cliente, data.tipo_id_cliente, data.identificacion_cliente, data.telefono_cliente);

                    var vendedor = Vendedor.get(data.nombre_vendedor, data.tipo_id_vendedor, data.idetificacion_vendedor, '');

                    pedido.setDatos(data);
                    pedido.setNumeroPedido(data.numero_pedido).set_vendedor(vendedor).setCliente(cliente);
                    pedido.setTipoPedido(data.tipo_pedido);
                    pedido.set_descripcion_estado_actual_pedido(data.descripcion_estado_actual_pedido);
                    pedido.setFechaRegistro(data.fecha_registro);
                    pedido.setEstado(data.estado);
                    pedido.setTieneDespacho(data.tiene_despacho).
                            setDespachoEmpresaId(data.despacho_empresa_id).
                            setDespachoPrefijo(data.despacho_prefijo).
                            setDespachoNumero(data.despacho_numero).
                            setFacturaFiscal(data.factura_fiscal).
                            setEstadoFacturaFiscal(data.estado_factura_fiscal);
                    $scope.Empresa.set_pedidos(pedido);
                });

            };
            
            
            that.ventanaFacturasPedido = function(pedido) {
                
                console.log("pedido ", pedido);
               
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: true,
                    keyboard: true,
                    templateUrl: 'views/generacionpedidos/pedidosclientes/listarfacturaspedido.html',
                    scope: $scope,                  
                    controller: "listarFacturasPedido",
                    resolve: {
                        pedido: function() {
                            return pedido;
                        }
                    }           
                };
                var modalInstance = $modal.open($scope.opts);   

                modalInstance.result.then(function(){ 
                },function(){});  

            };
            /**
             * +Descripcion Servicio encargado de listar las facturas de un pedido
             * @author Cristian Manuel Ardila
             * @fecha 2017-01-03 YYYY-MM-DD
             */
            $scope.ventanaFacturasPedido = function(entity){
                
                //console.log("entity ", entity.numero_pedido);
                
                var obj = {
                    session: $scope.session,
                    data: {
                        pedidos_clientes: {
                            numeroPedido: entity.numero_pedido
                        }
                    }
                };
                Request.realizarRequest(API.PEDIDOS.CLIENTES.LISTAR_FORMULA_PEDIDO, "POST", obj, function(data) {
                    if (data.status === 200) {
                       
                        that.ventanaFacturasPedido(data.obj.listar_tipo_documento)
                    }

                });
                //LISTAR_FORMULA_PEDIDO
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
                    {field: 'getFacturaFiscal()', displayName: 'Factura', width:  "10%", visible:  true},
                    {field: 'getCliente().get_descripcion()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_vendedor().get_descripcion()', displayName: 'Vendedor', width: "25%"},
                    {field: 'getFechaRegistro()', displayName: "F. Registro", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_visualizar_pedidos }}" ng-click="visualizar(row.entity)" >Visualizar</a></li>\
                                                <li ng-if="row.entity.getEstadoActualPedido() == \'0\' || row.entity.getEstadoActualPedido() == \'8\' " ><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_modificar_pedidos }}" ng-click="modificar_pedido_cliente(row.entity)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ habilitar_observacion_cartera(row.entity) }}" ng-click="generar_observacion_cartera(row.entity)" >Cartera</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_reporte_pedidos }}" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ datos_view.permisos_pedidos.btn_email_pedidos }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                                <li ng-if="row.entity.getEstadoFacturaFiscal() == 1"><a href="javascript:void(0);" ng-click="ventanaFacturasPedido(row.entity)" >Listar facturas</a></li>\
                                                <li ng-if="row.entity.getTieneDespacho()">\
                                                <a href="javascript:void(0);" ng-click="imprimirDespacho(row.entity)">Documento Despacho</a>\
                                            </li>\
                                             <li ng-if="datos_view.opciones.sw_consultar_logs">\
                                                <a href="javascript:void(0);" ng-click="onTraerLogsPedidos(row.entity)">Ver logs</a>\
                                            </li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };
             
            $scope.onTraerLogsPedidos = function(pedido) {

                var empresa = Sesion.getUsuarioActual().getEmpresa();

                $scope.opts = {
                    size: 'lg',
                    backdrop: 'static',
                    dialogClass: "editarproductomodal",
                    templateUrl: '../includes/components/logspedidos/logspedidos.html',
                    controller: "LogsPedidosController",
                    windowClass: 'app-modal-window-xlg',
                    resolve: {
                        pedido: function() {
                            return pedido;
                        },
                        tipoPedido: function() {
                            return  '0';
                        },
                        empresaId: function() {
                            return empresa.getCodigo();
                        }
                    }
                };

                var modalInstance = $modal.open($scope.opts);
                //refrescar producto
                modalInstance.result.then(function() {
                   
                }, function() {

                });

            };

            /**
             * +Descripcion: Metodo encargado de listar todos los pedidos
             *               creados
             * @param {type} estado
             * @param {type} estadoSolicitud
             */
            $scope.cargarListaPedidos = function(estado, estadoSolicitud) {
                that.buscar_pedidos(estado, estadoSolicitud);

            };

            /**
             * +Descripcion: Metodo encargado de listar todos los pedidos con
             *               con estado = 4 ( Debe autorizar cartera )
             * @param {type} estado
             * @param {type} estadoSolicitud
             */
            $scope.cargarListaNotificacionPedidos = function(estado, estadoSolicitud) {
                $scope.datos_view.termino_busqueda_pedidos = '';
                that.buscar_pedidos(estado, estadoSolicitud);
                $scope.notificacionPedidoAutorizar = 0;
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
                that.buscar_pedidos('', '');
            };

            $scope.pagina_siguiente_pedidos = function() {
                $scope.datos_view.paginando_pedidos = true;
                $scope.datos_view.pagina_actual_pedidos++;
                that.buscar_pedidos('', '');
            };

            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * +Descripcion: handler para imprimir el despacho de un pedido
             */
            $scope.imprimirDespacho = function(pedido) {

                var test = {
                    session: $scope.session,
                    data: {
                        movimientos_bodegas: {
                            empresa: pedido.getDespachoEmpresaId(),
                            numero: pedido.getDespachoNumero(),
                            prefijo: pedido.getDespachoPrefijo()
                        }
                    }
                };
                Request.realizarRequest(API.DOCUMENTOS_DESPACHO.IMPRIMIR_DOCUMENTO_DESPACHO, "POST", test, function(data) {
                    if (data.status === 200) {
                        var nombre = data.obj.movimientos_bodegas.nombre_pdf;
                        $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                    }

                });

            };

            /**
             * @author Cristian Ardila
             * +Descripcion: Funcion encargada de mostrar las notificaciones
             *               (alerts) cada vez que se actualice el estado de
             *               un pedido ó cotizacion
             * @param {type} title
             * @param {type} body
             * @returns {void}
             */
            that.notificarSolicitud = function(title, body) {

                webNotification.showNotification(title, {
                    body: body,
                    icon: '/images/logo.png',
                    onClick: function onNotificationClicked() {

                    },
                    autoClose: 90000 //auto close the notification after 2 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Error interno: ' + error.message);
                    } else {

                        setTimeout(function hideNotification() {

                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 90000);
                    }
                });
            }

            /*
             * @Author: Cristian Ardila
             * @param {PedidoFarmacia} pedido
             * +Descripcion: Permite refrescar  la lista de cotizaciones
             *               en tiempo real a traves de los sockets, cambiando
             *               actualizando el nuevo estado de la cotizacion
             */
            socket.on("onListarEstadoCotizacion", function(datos) {
                
                console.log("Resultado de onListarEstadoCotizacion ", datos);
                if (datos.status === 200) {
                    var estado = ['Inactivo', 'Activo', 'Anulado', 'Aprobado cartera', 'No autorizado por cartera', 'Tiene un pedido', 'Se solicita autorizacion']
                    $scope.Empresa.get_cotizaciones().forEach(function(data) {

                        if (datos.obj.numeroCotizacion === data.get_numero_cotizacion()) {

                            data.set_descripcion_estado_cotizacion(estado[datos.obj.estado[0].estado]);
                            data.set_estado_cotizacion(datos.obj.estado[0].estado);
                        }
                    });

                    if (datos.obj.estado[0].estado === '6') {

                        if ($scope.datos_view.opciones.sw_notificar_aprobacion === true) {
                            $scope.notificacionClientesAutorizar++;
                            that.notificarSolicitud("Solicitud aprobacion", "Cotización # " + datos.obj.numeroCotizacion);
                             
                        }
                            
                    }
                    
                }
            });


            /**
             * @author Cristian Ardila
             * +Descripcion: Socket que se activa cada vez que se genere un cambio
             *               en un pedido, de tal forma que cambiara en tiempo real
             *               el estado del pedido en el gridView de pedidos 
             */
            socket.on("onListarEstadoPedido", function(datos) {

                if (datos.status === 200) {

                    var estado = ['Inactivo', 'No asignado', 'Anulado',
                        'Entregado', 'Debe autorizar cartera']

                    $scope.Empresa.get_pedidos().forEach(function(data) {

                        if (datos.obj.numero_pedido === data.get_numero_pedido()) {
                            data.set_descripcion_estado_actual_pedido(estado[datos.obj.pedidos_clientes[0].estado]);
                        }
                    });

                    if (datos.obj.pedidos_clientes[0].estado === '4') {

                        $scope.notificacionPedidoAutorizar++;
                        if ($scope.datos_view.opciones.sw_notificar_aprobacion === true) {
                            that.notificarSolicitud("Solicitud aprobacion", "Pedido # " + datos.obj.numero_pedido);
                            
                        }
                    }
                }
            });
            
            
           /**
             * @author Eduar Garcia
             * +Descripcion: Socket que permite modificar el estado de separacion del pedido de cliente
             */
            socket.on("onListarPedidosClientes", function(datos) {
                if (datos.status === 200) {
                    var _pedidos = datos.obj.pedidos_clientes;

                    $scope.Empresa.get_pedidos().forEach(function(data) {
                        
                        for(var i in _pedidos){
                            var _pedido = _pedidos[i];
                            if (_pedido.numero_pedido === data.get_numero_pedido()) {
                                data.set_descripcion_estado_actual_pedido(_pedido.descripcion_estado_actual_pedido);
                                data.setEstadoActualPedido(_pedido.estado_actual_pedido);
                            }
                            
                        }
                        
                    });
                }
            });


            that.init = function(callback) {

                callback();
            };


            that.init(function() {
                
                if (!Sesion.getUsuarioActual().getEmpresa()) {
                    AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
                } else {

                    if (!Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                            Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {

                        AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");

                    } else {

                        if (!Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {

                            AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                        } else {

                            $scope.Pedido = Pedido.get(
                                    Sesion.getUsuarioActual().getEmpresa().getCodigo(),
                                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getCodigo(),
                                    Sesion.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                                    );

                            that.validacion_inicial();

                            that.cargar_permisos();

                            that.buscar_cotizaciones('');

                            that.buscar_pedidos('', '');

                            $scope.datos_view.inactivarTab = true;
                            
                        }
                    }
                }
            });




            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                 
                socket.remove(['onListarEstadoCotizacion','onListarPedidosClientes','onListarEstadoPedido']);  
                                     
            });

        }]);
});