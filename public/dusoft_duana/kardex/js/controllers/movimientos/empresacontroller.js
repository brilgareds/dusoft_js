
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('empresacontroller', ['$scope', 'Empresa', 'Producto',
        function($scope, Empresa, Producto) {
            $scope.agencia = Empresa;
        }]);
});