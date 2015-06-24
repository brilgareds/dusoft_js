define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('CalcularValoresProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance', 'index',
        function($scope, $rootScope, API, $modalInstance, index) {

            $scope.cantidad = $scope.producto_seleccionado.get_cantidad_seleccionada() || '';
            $scope.presentacion = $scope.producto_seleccionado.get_cantidad_presentacion() || '';
            $scope.valor = '';

            $scope.unidades = '';
            $scope.precio_compra = '';

                       
            $scope.calcular_precio_compra = function() {

                $scope.unidades = ($scope.presentacion * $scope.cantidad);
                $scope.precio_compra = (($scope.cantidad * $scope.valor) / ($scope.presentacion * $scope.cantidad));
            };

            $scope.isNaN = function(e) {
                return isNaN(e);
            };


            $scope.aceptar = function() {

                $scope.producto_seleccionado.cantidad = $scope.unidades;
                $scope.producto_seleccionado.set_cantidad_seleccionada($scope.unidades);
                $scope.producto_seleccionado.set_costo($scope.precio_compra);

                $scope.orden_compra.set_productos($scope.producto_seleccionado);

                $scope.gestionar_orden_compra(function(resultado) {

                    if (resultado) {
                        // Remover producto seleccionado
                        var index = index;
                        $scope.lista_productos.selectItem(index, false);
                        $scope.Empresa.get_productos().splice(index, 1);
                        $modalInstance.close();
                    }
                });
            };


            $scope.close = function() {

                $modalInstance.close();
            };



        }]);
});