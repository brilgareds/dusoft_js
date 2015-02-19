
define(["angular", "js/controllers", "js/models"], function(angular, controllers) {

    controllers.controller('HabilitarModulosEmpresaController', ['$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario", "$modalInstance",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, Usuario, $modalInstance) {
            
            
            $scope.listado_empresas = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_empresa', displayName: 'Nombre Empresa'}
                ]

            };
            
            
            $scope.listado_roles = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_rol', displayName: 'Nombre Rol'}
                ]

            };
            
            
            $scope.close = function(){
                $modalInstance.close();
            };

            
        }]);
});