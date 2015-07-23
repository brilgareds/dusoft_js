
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

            // Inicializacion Pedido
            $scope.Pedido = Pedido.get();
            $scope.Pedido.setCliente(Cliente.get());
            $scope.Pedido.setFechaRegistro($filter('date')(new Date(), "dd/MM/yyyy"));

            $scope.datos_view = {
                termino_busqueda_clientes: ''
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
                            empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
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

                    $scope.Empresa.set_clientes(cliente);
                });
            };

            // Vendedores
            that.buscar_vendedores = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.TERCEROS.LISTAR_VENDEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_vendedores(data.obj.listado_vendedores);
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
            $scope.buscar_productos = function() {

                $scope.slideurl = "views/generacionpedidos/pedidosclientes/gestionarproductosclientes.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos_clientes');
            };

            $scope.cerrar_busqueda_productos = function() {

                $scope.$emit('cerrar_gestion_productos_clientes', {animado: true});
            };

            // Lista Productos Seleccionados
            $scope.lista_productos = {
                data: 'planilla.get_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                showFooter: true,
                footerTemplate: '<div class="row col-md-12">\
                                    <div class="col-md-3 pull-right">\
                                        <table class="table table-clear">\
                                            <tbody>\
                                                <tr>\
                                                    <td class="left"><strong>Subtotal</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_cajas() }}</td>    \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>I.V.A</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_neveras() }}</td>                                        \
                                                </tr>\
                                                <tr>\
                                                    <td class="left"><strong>Total</strong></td>\
                                                    <td class="right">{{ planilla.get_cantidad_neveras() }}</td>                                        \
                                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                 </div>',
                columnDefs: [
                    {field: 'get_tercero()', displayName: 'Codigo', width: "35%"},
                    {field: 'get_descripcion()', displayName: 'Descripcion', width: "25%"},
                    {field: 'get_cantidad_cajas()', displayName: 'Cant.', width: "10%"},
                    {field: 'get_cantidad_neveras()', displayName: 'I.V.A', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Vlr. Unit', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Subtotal', width: "10%"},
                    {field: 'get_temperatura_neveras()', displayName: 'Total', width: "10%"},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="confirmar_eliminar_documento_planilla(row.entity)" ng-disabled="planilla.get_estado()==\'2\'" ><span class="glyphicon glyphicon-remove"></span></button>\
                                        </div>'
                    }
                ]
            };


            
            that.buscar_vendedores();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});