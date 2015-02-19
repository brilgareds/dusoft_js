
define([
    "angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/HabilitarModulosEmpresaController"
], function(angular, controllers) {

    controllers.controller('AdministracionModulosController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket",
        "$timeout", "AlertService", "Usuario", "$modal",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, Usuario, $modal) {

            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };


            $scope.data = [];
            $scope.listado_opciones = {
                data: '[]',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'nombre_opcion', displayName: 'Nombre Opcion'},
                    {field: 'alias', displayName: 'Alias'}
                ]

            };

            var test = {
                session: $scope.session,
                data: {
                    movimientos_bodegas: {
                        empresa: '03',
                        numero: '82916',
                        prefijo: 'EFC'
                    }
                }
            };

            
            Request.realizarRequest("/api/movBodegas/imprimirDocumentoDespacho", "POST", test, function(data) {
                if (data.status === 200) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>");
                    $scope.data = [{"id": "ajson1", "parent": "#", "text": "ajson1"},
                        {"id": "ajson2", "parent": "#", "text": "ajson2"},
                        {"id": "ajson3", "parent": "ajson2", "text": "ajson3"},
                        {"id": "ajson4", "parent": "ajson2", "text": "ajson4"},
                        {"id": "ajson5", "parent": "ajson4", "text": "ajson5"},
                        {"id": "ajson6", "parent": "ajson4", "text": "ajson6"},
                        {"id": "ajson7", "parent": "ajson6", "text": "ajson7"},
                        {"id": "ajson8", "parent": "ajson6", "text": "ajson8"}
                    ];

                }

            });


            $scope.onHabilitarModuloEnEmpresas = function() {

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    size: 'lg',
                    templateUrl: 'views/AdministracionModulos/Modulos/habilitarModuloEmpresa.html',
                    controller: "HabilitarModulosEmpresaController",
                    resolve: {
                    }
                };



                var modalInstance = $modal.open($scope.opts);

            };




        }]);
});