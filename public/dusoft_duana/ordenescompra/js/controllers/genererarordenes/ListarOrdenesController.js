
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ListarOrdenesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state) {

            var that = this;

            $scope.OrdenesCompras = [];

            for (var i = 0; i <= 1000; i++) {
                $scope.OrdenesCompras.push({numero_orden: i, proveedor: 'Proveedor ' + i, direccion: i, telefono: i, fecha_registro: i});
            }

            $scope.lista_ordenes_compras = {
                data: 'OrdenesCompras',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_orden', displayName: 'Numero Pedido'},
                    {field: 'proveedor', displayName: 'Cliente'},
                    {field: 'direccion', displayName: 'Ubicacion'},
                    {field: 'telefono', displayName: 'Telefono'},
                    {field: 'fecha_registro', displayName: "Fecha Registro"},
                    //{displayName: "Opciones", cellClass: "txt-center", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'} 
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Acción<span class="caret"></span></button>\
                                            <ul class="dropdown-menu dropdown-options">\
                                                <li><a href="#" ng-click="gestionarOrdenCompra()" >Modificar</a></li>\
                                                <li><a href="#">Imprimir</a></li>\
                                                <li><a href="#">Enviar Email</a></li>\
                                                <li class="divider"></li>\
                                                <li><a href="#">Inactivar</a></li>\
                                                <li><a href="#">Eliminar</a></li>\
                                            </ul>\
                                        </div>'
                    }
                ]
            };

            $scope.gestionarOrdenCompra = function() {
                $state.go('GestionarOrdenCompra');
            };
            

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});