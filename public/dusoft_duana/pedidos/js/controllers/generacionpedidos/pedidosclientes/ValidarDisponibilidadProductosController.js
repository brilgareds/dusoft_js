
define(["angular", "js/controllers",
    "models/generacionpedidos/pedidosclientes/Laboratorio",
    "models/generacionpedidos/pedidosclientes/Molecula"
], function(angular, controllers) {

    controllers.controller('ValidarDisponibilidadProductosController', [
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
        "Laboratorio",
        "ProductoPedidoCliente",
        "Usuario", "Molecula", "$sce","pedido","swBotonDenegarCartera","$modalInstance",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Laboratorio, Producto, Sesion, Molecula, $sce, productos,swBotonDenegarCartera,$modalInstance) {

            var that = this;

                $scope.datos_view.productos_no_disponible = productos;
                $scope.datos_view.swBotonDenegarCartera = swBotonDenegarCartera;
                console.log("numeroPedidoTipo ", $scope.datos_view.productos_no_disponible);
                console.log("swHabilidadBotonDenegarCartera ", swBotonDenegarCartera);
                
                
                $scope.cerrarVentanaDisponibilidad = function(){
                    
                    $modalInstance.close();
                };
                socket.on("onCerrarVentanaCartera", function(datos) {
                    console.log("LLLEGOOO ", datos);
                });
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
                //$scope.datos_form = null;
                socket.remove(['onCerrarVentanaCartera']);
                //socket.removeAllListeners();
            });
        }]);
});
