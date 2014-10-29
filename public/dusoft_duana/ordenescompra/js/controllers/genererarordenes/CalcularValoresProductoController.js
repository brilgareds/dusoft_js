define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('CalcularValoresProductoController', [
        '$scope', '$rootScope', 'API',
        '$modalInstance',
        function($scope, $rootScope, API, $modalInstance) {


            $modalInstance.result.then(function() {

            }, function() {
                
            });


            $scope.close = function() {
                
                $modalInstance.close();
            };



        }]);
});