
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ListarLogsOrdenCompraController', [
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
        "Usuario", "$sce","$modalInstance","productos",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                 Sesion, $sce,$modalInstance, productos) {

            var that = this;
                        
            $scope.root = {
                productos : productos
            };
    
            $scope.listaLogOC = {
                data: 'root.productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                
                    {field: 'orden_compra_id', displayName: 'OC', width:"5%"},
                    {field: 'nombre', displayName: 'NOMBRE', width:"10%"},
                    {field: 'producto', displayName: 'COD. PROD.', width:"5%"},
                    {field: 'accion', displayName: 'ACCION', width: "5%"},
                    {field: 'fecha', displayName: 'FECHA', width: "8%"},
                    {field: 'tabla', displayName: 'TABLA', width:"10%"},
                    {field: 'detalle', displayName: 'FUNCION', width: "15%", cellFilter: "currency:'$ '", enableCellEdit: true,
                        cellTemplate: '<div class="ngCellText">\
                                            <span class="label label-primary" >{{row.entity.detalle.descripcion}}</span>\
                                        </div>'},
                    {field: 'detalle[0].observacion', displayName: 'PARAMETROS', width:"33%"}                    
                ]
            };

            $scope.cerrarVentanaLogOC = function(){
                $modalInstance.close();
            };
                
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});