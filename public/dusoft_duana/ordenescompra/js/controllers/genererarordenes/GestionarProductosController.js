
define(["angular", "js/controllers",
    "models/OrdenCompraPedido",
    "models/EmpresaOrdenCompra",
    "models/ProveedorOrdenCompra",
    "models/UnidadNegocio",
    "models/UsuarioOrdenCompra"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "OrdenCompraPedido",
        "EmpresaOrdenCompra",
        "ProveedorOrdenCompra",
        "UnidadNegocio",
        "UsuarioOrdenCompra",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,OrdenCompra, Empresa, Proveedor, UnidadNegocio, Usuario, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;
            
            console.log('== Empresa ==');
            console.log($scope.Empresa);
            return

            $scope.Productos = [];

            for (var i = 0; i <= 1000; i++) {
                $scope.Productos.push({codido_producto: i, descripcion_producto: 'descripcion_producto ' + i, direccion: i, telefono: i, fecha_registro: i});
            }

            $scope.lista_productos = {
                data: 'Productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
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


            $scope.calcular_valores_producto = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'views/genererarordenes/calcularvaloresproducto.html',
                    controller: "CalcularValoresProductoController"
                };

                var modalInstance = $modal.open($scope.opts);

            };

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});