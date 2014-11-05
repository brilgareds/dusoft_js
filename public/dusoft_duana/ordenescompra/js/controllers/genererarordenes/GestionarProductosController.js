
define(["angular", "js/controllers",
    "models/EmpresaOrdenCompra",
    "models/Laboratorio"], function(angular, controllers) {

    controllers.controller('GestionarProductosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        "EmpresaOrdenCompra",
        "Laboratorio",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, Empresa, Laboratorio, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.usuario_id,
                auth_token: Sesion.token
            };


            $rootScope.$on('gestionar_productosCompleto', function() {

                that.buscar_laboratorios();
            });


            that.buscar_laboratorios = function(termino) {

                var termino = termino || "";

                var obj = {
                    session: $scope.session,
                    data: {
                        laboratorios: {
                            termino_busqueda: termino
                        }
                    }
                };

                console.log('=== Obj Laboratorios ====');
                console.log(obj);

                Request.realizarRequest(API.LABORATORIOS.LISTAR_LABORATORIOS, "POST", obj, function(data) {

                    console.log('=== Resultado Laboratorios ====');
                    console.log(data);                    

                    if (data.status === 200) {
                        that.render_laboratorios(data.obj.laboratorios);
                    }
                });
            };


            that.render_laboratorios = function(laboratorios) {

                $scope.Empresa.limpiar_laboratorios();

                laboratorios.forEach(function(data) {

                    var laboratorio = Laboratorio.get(data.laboratorio_id, data.tercero_id, data.descripcion_laboratorio);

                    $scope.Empresa.set_proveedores(laboratorio);
                });
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