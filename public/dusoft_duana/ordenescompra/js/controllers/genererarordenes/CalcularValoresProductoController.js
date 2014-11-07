define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('CalcularValoresProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'producto_seleccionado',
        function($scope, $rootScope, API, $modalInstance, Producto) {

            console.log('====== Producto =======');
            console.log(Producto);
            
            $scope.Producto = Producto;
            

            $modalInstance.result.then(function() {

            }, function() {
                
            });


            $scope.close = function() {
                
                $modalInstance.close();
            };



        }]);
});