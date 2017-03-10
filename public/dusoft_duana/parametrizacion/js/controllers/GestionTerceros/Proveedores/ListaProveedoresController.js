define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    "controllers/GestionTerceros/Proveedores/GuardarProveedorController"], function(angular, controllers) {

    controllers.controller('ListaProveedoresController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {};
            var self = this;
            
            
            $scope.listaProveedores = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Identificación'},
                    {field: 'usuario', displayName: 'Dirección'}
                ]

            };
            
            $scope.onIrVistaGuardarProveedor = function(){
                $state.go("GuardarProveedor");
            };
            

        }]);
        
});
