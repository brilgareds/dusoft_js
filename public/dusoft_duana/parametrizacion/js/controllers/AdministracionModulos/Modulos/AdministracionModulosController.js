
define([
        "angular", "js/controllers", "js/models",
        "controllers/AdministracionModulos/Modulos/HabilitarModulosEmpresaController"
        ], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request', 
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario", "$modal",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, Usuario, $modal) {


            $scope.listado_opciones = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_opcion', displayName: 'Nombre Opcion'},
                    {field: 'alias', displayName: 'Alias'}
                ]

            };
            
            
            $scope.onHabilitarModuloEnEmpresas = function() {
                
                 $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    size:'lg',
                    templateUrl: 'views/AdministracionModulos/Modulos/habilitarModuloEmpresa.html',
                    controller: "HabilitarModulosEmpresaController",
                    resolve :{
                         
                    }
                };



                var modalInstance = $modal.open($scope.opts);

            };



            
        }]);
});