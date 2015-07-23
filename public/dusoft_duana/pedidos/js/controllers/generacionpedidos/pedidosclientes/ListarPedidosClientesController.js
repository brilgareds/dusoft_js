
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/EmpresaPedidoCliente",
    "models/generacionpedidos/pedidosclientes/PedidoCliente",
    "models/generacionpedidos/pedidosclientes/ClientePedido",
    "models/generacionpedidos/pedidosclientes/VendedorPedidoCliente",
], function(angular, controllers) {

    controllers.controller('ListarPedidosClientesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter) {

            var that = this;




            $scope.gestionar_cotizacion_cliente = function() {

                $state.go('Cotizaciones');

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
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "9%"},
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
                data: 'Empresa.get_planillas()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'get_numero_guia()', displayName: 'Estado', width: "10%"},
                    {field: 'get_transportadora().get_descripcion()', displayName: 'No. Cotización', width: "10%"},
                    {field: 'get_ciudad().get_nombre_ciudad()', displayName: 'Cliente', width: "30%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Vendedor', width: "25%"},
                    {field: 'get_cantidad_neveras()', displayName: 'Valor', width: "10%"},
                    {field: 'get_fecha_registro()', displayName: "F. Registro", width: "9%"},
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

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});