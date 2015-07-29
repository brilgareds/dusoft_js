
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
                termino_busqueda_cotizaciones: '',
                ultima_busqueda_cotizaciones: '',
                fecha_inicial_cotizaciones: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                fecha_final_cotizaciones: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                pagina_actual_cotizaciones: 1,
                cantidad_items_cotizaciones: 0,
                paginando_cotizaciones: false
            };

            // Cotizaciones 
            $scope.gestionar_cotizacion_cliente = function() {
                
                localStorageService.add("numero_cotizacion", 0);
                $state.go('Cotizaciones');
            };
            
            $scope.modificar_cotizacion_cliente = function(cotizacion) {
                
                localStorageService.add("numero_cotizacion", cotizacion.get_numero_cotizacion());
                $state.go('Cotizaciones');
            };
            
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

                    $scope.datos_view.ultima_busqueda_cotizaciones = $scope.datos_view.termino_busqueda_cotizaciones;

                    if (data.status === 200) {

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
                    cotizacion.set_tipo_producto(data.tipo_producto);
                    cotizacion.setFechaRegistro(data.fecha_registro);

                    $scope.Empresa.set_cotizaciones(cotizacion);
                });
            };

            $scope.lista_pedidos_clientes = {
                data: 'Empresa.get_planillas()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: 'Estado', width: "10%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'No. Pedido', width: "10%"},
                    {field: 'get_ciudad().get_nombre_ciudad()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Vendedor', width: "25%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Valor', width: "10%"},
                    {field: 'getFechaRegistro()', displayName: "F. Registro", width: "9%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="gestionar_planilla_despacho(row.entity,true)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="generar_reporte(row.entity,false)" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ validar_envio_email(row.entity) }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
            };

            $scope.lista_cotizaciones_clientes = {
                data: 'Empresa.get_cotizaciones()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: 'Estado', width: "10%"},
                    {field: 'get_numero_cotizacion()', displayName: 'No. Cotización', width: "10%"},
                    {field: 'getCliente().get_descripcion()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_vendedor().get_descripcion()', displayName: 'Vendedor', width: "25%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Valor', width: "10%"},
                    {field: 'getFechaRegistro()', displayName: "F. Registro", width: "9%", cellFilter: 'date : "dd-MM-yyyy" '},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="javascript:void(0);" ng-click="modificar_cotizacion_cliente(row.entity)" >Modificar</a></li>\
                                                <li><a href="javascript:void(0);" ng-click="" >Ver PDF</a></li>\
                                                <li><a href="javascript:void(0);" ng-validate-events="{{ validar_envio_email(row.entity) }}" ng-click="ventana_enviar_email(row.entity)" >Enviar por Email</a></li>\
                                            </ul>\
                                       </div>'
                    }
                ]
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

            that.buscar_cotizaciones();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});