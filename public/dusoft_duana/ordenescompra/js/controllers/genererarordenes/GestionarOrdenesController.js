
define(["angular", "js/controllers", 'includes/slide/slideContent',
    "controllers/genererarordenes/GestionarProductosController",
    "controllers/genererarordenes/CalcularValoresProductoController"
], function(angular, controllers) {

    controllers.controller('GestionarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter, OrdenCompra, Empresa, Proveedor, UnidadNegocio, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };


            $scope.buscar_proveedores = function(termino) {

                var termino = termino || "";

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: termino
                        }
                    }
                };
                
                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_proveedores(data.obj.proveedores);
                    }
                });
            };
            
            $scope.buscar_unidades_negocio = function(termino) {

                
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            $scope.buscar_productos = function() {

                $scope.slideurl = "views/genererarordenes/gestionarproductos.html?time=" + new Date().getTime();

                $scope.$emit('gestionar_productos');
            };

            $scope.cerrar = function() {

                $scope.$emit('cerrar_gestion_productos', {animado: true});
            };

            $scope.Productos = [];

            for (var i = 0; i <= 1000; i++) {
                $scope.Productos.push({codido_producto: i, descripcion_producto: 'descripcion_producto ' + i, direccion: i, telefono: i, fecha_registro: i});
            }

            $scope.lista_productos = {
                data: 'Productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                showFooter: true,
                //footerTemplate: '<div style="width: 200px; display: inline-block;">{{getTotal(0)}}</div><div style="width: 200px; display: inline-block;">{{total2}}</div><div style="width: 200px; display: inline-block;">{{total3}}</div>',
                columnDefs: [
                    {field: 'codido_producto', displayName: 'Codigo Producto', width: "20%"},
                    {field: 'descripcion_producto', displayName: 'Descripcion'},
                    {field: 'costo_ultima_compra', displayName: '$$ última compra', width: "15%"},
                    {field: 'cantidad', width: "7%", displayName: "Cantidad", enableCellEdit: true},
                    {width: "7%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="calcular_valores_producto()" ><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                        </div>'}
                ]
            };


            $scope.buscar_proveedores();


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});